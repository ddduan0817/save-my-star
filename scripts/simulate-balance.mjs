// 平衡性回归 —— 蒙特卡洛模拟。
//
// 目的：不改核心逻辑，纯从外部随机（或按启发式策略）驱动整局，跑上万局后
// 统计【各结局命中率 / 平均存活天数 / 平均终局数值 / 各画像分布】，用数据
// 找失衡点：哪些结局几乎抽不到、是否存在无脑赢的 dominant 策略。
//
// 运行：node scripts/simulate-balance.mjs [--games N] [--seed S] [--strategy-games K]
//
// 实现要点：
//   1. 用 esbuild 把 useGameStore（Zustand 单例）+ artists 打成一个临时 ESM，
//      复用 build-minitool 的 @/ 别名与 next/navigation shim 解析。
//   2. 导入前先注入内存版 window / localStorage，并用可复现的种子替换
//      Math.random（引擎大量依赖 Math.random 做波动/反转/事件抽取）。
//   3. 严格按 gamePhase 状态机驱动：来电 → processing_message(选选项) →
//      showing_outcome / showing_twist(消化) → playing(开消息 or endDay)，
//      直到 gamePhase==='ended'，读取 ending / currentDay / stats。

import esbuild from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');

// ---- CLI 参数 --------------------------------------------------------------
function argInt(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i === -1 || i === process.argv.length - 1) return fallback;
  const v = parseInt(process.argv[i + 1], 10);
  return Number.isFinite(v) ? v : fallback;
}
const GAMES = argInt('--games', 10000);          // 随机策略基线局数
const STRATEGY_GAMES = argInt('--strategy-games', 1500); // 每种启发式策略局数
const SEED = argInt('--seed', 20260922);

// ---- esbuild 别名解析（复用 build-minitool 的逻辑） ------------------------
const exts = ['.tsx', '.ts', '.jsx', '.js', '.json'];
function resolveWithExt(base) {
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const e of exts) if (fs.existsSync(base + e)) return base + e;
  for (const e of exts) {
    const idx = path.join(base, 'index' + e);
    if (fs.existsSync(idx)) return idx;
  }
  return base;
}
const aliasPlugin = {
  name: 'sim-alias',
  setup(build) {
    build.onResolve({ filter: /^next\/navigation$/ }, () => ({
      path: path.join(srcDir, 'minitool', 'next-navigation-shim.ts'),
    }));
    build.onResolve({ filter: /^@\// }, args => ({
      path: resolveWithExt(path.join(srcDir, args.path.slice(2))),
    }));
  },
};

async function buildBundle() {
  const outfile = path.join(os.tmpdir(), `sim-bundle-${process.pid}.mjs`);
  await esbuild.build({
    stdin: {
      contents: `
        export { useGameStore } from '@/stores/gameStore';
        export { artists } from '@/data/artists';
      `,
      resolveDir: root,
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: ['node18'],
    outfile,
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [aliasPlugin],
    logLevel: 'silent',
  });
  return outfile;
}

// ---- 运行时桩：window / localStorage / 可复现 RNG --------------------------
function installStubs(seed) {
  const mem = new Map();
  globalThis.localStorage = {
    getItem: k => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => { mem.set(k, String(v)); },
    removeItem: k => { mem.delete(k); },
    clear: () => mem.clear(),
  };
  if (typeof globalThis.window === 'undefined') globalThis.window = globalThis;

  // mulberry32：可复现的确定性 PRNG，替换 Math.random
  let s = seed >>> 0;
  Math.random = function () {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- 选项策略 --------------------------------------------------------------
// 各策略在「当前合法选项」中打分取最大（并列随机），用来探测无脑策略是否碾压。
function validChoices(event, stats) {
  return event.choices.filter(c => {
    if (c.requireMinMoney !== undefined && stats.money < c.requireMinMoney) return false;
    if (c.requireMinFanLoyalty !== undefined && stats.fanLoyalty < c.requireMinFanLoyalty) return false;
    if (c.requireMaxPrRisk !== undefined && stats.prRisk > c.requireMaxPrRisk) return false;
    return true;
  });
}
const d = (c, k) => c.outcome?.statChanges?.[k] ?? 0;
const strategies = {
  random:        () => Math.random(),
  riskAverse:    c => -d(c, 'prRisk') * 10 + d(c, 'fanLoyalty'),
  moneyMax:      c => d(c, 'money'),
  fanMax:        c => d(c, 'fanLoyalty') * 10 - d(c, 'prRisk'),
  commercialMax: c => d(c, 'commercialValue') * 10 - d(c, 'prRisk'),
  balanced:      c => d(c, 'commercialValue') + d(c, 'fanLoyalty') + d(c, 'money') / 10000 - d(c, 'prRisk') * 1.5,
};
function pickChoice(event, stats, strategyKey) {
  const pool = validChoices(event, stats);
  const list = pool.length ? pool : event.choices;
  const scoreFn = strategies[strategyKey] ?? strategies.random;
  if (strategyKey === 'random') return list[Math.floor(Math.random() * list.length)];
  let best = list[0], bestScore = -Infinity;
  for (const c of list) {
    const sc = scoreFn(c) + Math.random() * 1e-6; // 并列微扰
    if (sc > bestScore) { bestScore = sc; best = c; }
  }
  return best;
}

// ---- 单局驱动 --------------------------------------------------------------
const ARCHETYPES = ['idol', 'actor', 'singer', 'influencer', 'socialite'];

function playOne(store, archetype, strategyKey) {
  store.getState().startGame(archetype);
  let guard = 0;
  const MAX_ITERS = 4000;
  while (store.getState().gamePhase !== 'ended') {
    if (++guard > MAX_ITERS) return { stuck: true };
    const s = store.getState();

    // 全屏来电优先处理
    if (s.showPhoneCall && s.pendingPhoneCall) {
      if (strategyKey === 'random' && Math.random() < 0.35) s.hangUpPhoneCall();
      else s.answerPhoneCall();
      continue;
    }

    switch (s.gamePhase) {
      case 'processing_message': {
        const event = s.currentEvents[s.currentEventIndex];
        if (!event) { s.closeMessage(); break; }
        s.selectChoice(pickChoice(event, s.stats, strategyKey));
        // 极端事件所有选项都被门槛拦下时 selectChoice 会静默返回、phase 不变，
        // 这里兜底关闭消息（非紧急）避免空转；紧急且无可选项属数据问题，直接判死。
        if (store.getState().gamePhase === 'processing_message') {
          const stillMsg = store.getState().messages.find(m => m.id === store.getState().activeMessageId);
          if (stillMsg?.isUrgent) return { stuck: true };
          s.closeMessage();
        }
        break;
      }
      case 'showing_outcome':
        s.dismissOutcome();
        break;
      case 'showing_twist':
        s.dismissTwist();
        break;
      case 'playing':
      default: {
        const nextMsg = s.messages.find(m => m.status !== 'resolved');
        if (nextMsg) s.openMessage(nextMsg.id);
        else if (!s.endDay()) {
          // 理论不该发生（未结算紧急消息才会 false，而我们已逐条处理）；
          // 兜底：强开一条紧急消息避免死循环
          const urgent = s.messages.find(m => m.isUrgent && m.status !== 'resolved');
          if (urgent) s.openMessage(urgent.id);
          else return { stuck: true };
        }
        break;
      }
    }
  }
  const fin = store.getState();
  return {
    stuck: false,
    endingId: fin.ending?.id ?? '(null)',
    day: fin.currentDay,
    stats: fin.stats,
    archetype,
  };
}

// ---- 统计聚合 --------------------------------------------------------------
function newAgg() {
  return { total: 0, stuck: 0, endings: {}, daySum: 0,
    stat: { commercialValue: 0, fanLoyalty: 0, prRisk: 0, money: 0 } };
}
function record(agg, r) {
  agg.total++;
  if (r.stuck) { agg.stuck++; return; }
  agg.endings[r.endingId] = (agg.endings[r.endingId] || 0) + 1;
  agg.daySum += r.day;
  for (const k of Object.keys(agg.stat)) agg.stat[k] += r.stats[k];
}

const pct = (n, d) => (d ? ((n / d) * 100).toFixed(2) : '0.00') + '%';
const fmtMoney = n => '¥' + Math.round(n).toLocaleString();

// 结局中文名 + 好坏分类（用于 dominant 策略判定）
const ENDING_META = {
  retirement_declaration: { name: '退圈宣言',   kind: 'bad' },
  cancelled:              { name: '全网封杀',   kind: 'bad' },
  scandal_king:           { name: '塌房之王',   kind: 'bad' },
  manager_breakup:        { name: '一拍两散',   kind: 'bad' },
  money_god:              { name: '捞金达人',   kind: 'gray' },
  true_friends:           { name: '我们是朋友', kind: 'good' },
  top_star:               { name: '顶流巅峰',   kind: 'good' },
  fan_favorite:           { name: '粉丝永远的神', kind: 'good' },
  comeback:               { name: '绝地翻盘',   kind: 'good' },
  transformed:            { name: '华丽转型',   kind: 'good' },
  steady_star:            { name: '稳定发展',   kind: 'gray' },
  retired:                { name: '主动退圈',   kind: 'gray' },
  fallen:                 { name: '过气艺人',   kind: 'bad' },
  '(null)':               { name: '⚠️ 无结局',  kind: 'bad' },
};
const ALL_ENDING_IDS = Object.keys(ENDING_META).filter(k => k !== '(null)');
const nameOf = id => (ENDING_META[id]?.name ?? id);

function goodRate(agg) {
  let good = 0;
  for (const [id, n] of Object.entries(agg.endings)) {
    if (ENDING_META[id]?.kind === 'good') good += n;
  }
  return good / (agg.total - agg.stuck || 1);
}

function printEndingTable(agg, title) {
  const played = agg.total - agg.stuck;
  console.log(`\n${title}（有效 ${played} 局，平均存活 ${(agg.daySum / played).toFixed(2)} 天）`);
  const rows = ALL_ENDING_IDS
    .map(id => ({ id, n: agg.endings[id] || 0 }))
    .sort((a, b) => b.n - a.n);
  for (const { id, n } of rows) {
    const meta = ENDING_META[id];
    const bar = '█'.repeat(Math.round((n / played) * 40));
    const tag = meta.kind === 'good' ? '✅' : meta.kind === 'bad' ? '❌' : '➖';
    const warn = n === 0 ? '   ← 从未触发' : (n / played < 0.005 ? '   ← 极罕见(<0.5%)' : '');
    console.log(`  ${tag} ${nameOf(id).padEnd(6)} ${pct(n, played).padStart(7)}  ${bar}${warn}`);
  }
  const nullN = agg.endings['(null)'] || 0;
  if (nullN) console.log(`  ⚠️  无结局(null) ${pct(nullN, played)} —— 引擎缺口，需排查`);
}

// ---- 主流程 ----------------------------------------------------------------
async function main() {
  console.log('🎲 save-my-star 平衡性回归（蒙特卡洛）');
  console.log(`   seed=${SEED}  基线随机局=${GAMES}  每策略局=${STRATEGY_GAMES}\n`);

  installStubs(SEED);
  const bundlePath = await buildBundle();
  let useGameStore, artists;
  try {
    ({ useGameStore, artists } = await import(pathToFileURL(bundlePath).href));
  } finally {
    // 用完即删，保持仓库干净
    fs.rmSync(bundlePath, { force: true });
  }
  const store = useGameStore;
  const archetypeIds = artists.map(a => a.id);

  const t0 = Date.now();

  // 1) 基线：随机策略，画像均匀轮换 —— 主报告
  const baseline = newAgg();
  const perArchetype = Object.fromEntries(archetypeIds.map(id => [id, newAgg()]));
  for (let i = 0; i < GAMES; i++) {
    const arch = archetypeIds[i % archetypeIds.length];
    const r = playOne(store, arch, 'random');
    record(baseline, r);
    record(perArchetype[arch], r);
  }

  printEndingTable(baseline, '【基线·随机选择】全画像结局分布');

  console.log('\n【基线·随机选择】终局平均数值');
  const bp = baseline.total - baseline.stuck;
  console.log(`   商业价值 ${(baseline.stat.commercialValue / bp).toFixed(1)}` +
    ` | 粉丝忠诚 ${(baseline.stat.fanLoyalty / bp).toFixed(1)}` +
    ` | 舆论风险 ${(baseline.stat.prRisk / bp).toFixed(1)}` +
    ` | 资金 ${fmtMoney(baseline.stat.money / bp)}`);
  if (baseline.stuck) console.log(`   ⚠️ 卡死局数 ${baseline.stuck}（状态机未推进，需排查）`);

  // 2) 各画像分布（找画像强弱失衡）
  console.log('\n【按画像】平均存活天数 + 好结局率（随机策略）');
  for (const id of archetypeIds) {
    const a = perArchetype[id];
    const p = a.total - a.stuck;
    const name = artists.find(x => x.id === id).title;
    console.log(`   ${name.padEnd(6)}(${id.padEnd(9)}) 存活 ${(a.daySum / p).toFixed(2)} 天` +
      ` | 好结局 ${pct([...Object.entries(a.endings)].reduce((s, [k, n]) => s + (ENDING_META[k]?.kind === 'good' ? n : 0), 0), p)}`);
  }

  // 3) 策略探测：找 dominant（无脑赢）策略
  console.log('\n【策略探测】不同启发式策略的好结局率（画像均匀，各 ' + STRATEGY_GAMES + ' 局）');
  const stratKeys = ['random', 'riskAverse', 'fanMax', 'commercialMax', 'moneyMax', 'balanced'];
  const stratAggs = {};
  for (const key of stratKeys) {
    const agg = newAgg();
    for (let i = 0; i < STRATEGY_GAMES; i++) {
      const r = playOne(store, archetypeIds[i % archetypeIds.length], key);
      record(agg, r);
    }
    stratAggs[key] = agg;
    const p = agg.total - agg.stuck;
    // 找该策略最高频结局
    const top = Object.entries(agg.endings).sort((a, b) => b[1] - a[1])[0];
    console.log(`   ${key.padEnd(13)} 好结局 ${pct([...Object.entries(agg.endings)].reduce((s, [k, n]) => s + (ENDING_META[k]?.kind === 'good' ? n : 0), 0), p).padStart(7)}` +
      ` | 存活 ${(agg.daySum / p).toFixed(1)}天` +
      ` | 最常见→ ${top ? nameOf(top[0]) + ' ' + pct(top[1], p) : '—'}`);
  }

  // dominant 判定：某策略好结局率显著高于随机基线
  const baseGood = goodRate(stratAggs.random);

  // 跨所有运行（基线 + 全策略）汇总：哪些结局在任何玩法下都从未出现
  const everSeen = new Set(Object.keys(baseline.endings));
  for (const agg of Object.values(stratAggs)) {
    for (const id of Object.keys(agg.endings)) everSeen.add(id);
  }
  const neverAnywhere = ALL_ENDING_IDS.filter(id => !everSeen.has(id));

  const dominant = stratKeys
    .filter(k => k !== 'random')
    .map(k => ({ k, r: goodRate(stratAggs[k]) }))
    .filter(x => x.r - baseGood > 0.15)
    .sort((a, b) => b.r - a.r);
  console.log('\n【结论线索】');
  console.log(`   随机基线好结局率 = ${pct(baseGood, 1)}`);
  if (dominant.length) {
    for (const x of dominant) {
      console.log(`   ⚠️ 疑似 dominant 策略：${x.k} 好结局率 ${pct(x.r, 1)}（比随机高 ${((x.r - baseGood) * 100).toFixed(1)} 个百分点）`);
    }
  } else {
    console.log('   ✅ 未发现明显 dominant 策略（各策略好结局率与随机基线差距 < 15pp）');
  }
  const never = ALL_ENDING_IDS.filter(id => (baseline.endings[id] || 0) === 0);
  const rare = ALL_ENDING_IDS.filter(id => {
    const n = baseline.endings[id] || 0;
    return n > 0 && n / bp < 0.005;
  });
  if (never.length) console.log(`   ⚠️ 随机基线下从未触发的结局：${never.map(nameOf).join('、')}`);
  if (rare.length) console.log(`   ⚠️ 极罕见结局(<0.5%)：${rare.map(nameOf).join('、')}`);
  if (neverAnywhere.length) {
    console.log(`   🚨 在任何策略下都从未触发的结局（几乎抽不到）：${neverAnywhere.map(nameOf).join('、')}`);
  } else {
    console.log('   ✅ 所有结局在至少一种策略下都能触达');
  }

  console.log(`\n⏱  用时 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

main().catch(err => { console.error(err); process.exit(1); });
