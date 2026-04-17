// 音效工具模块 - 使用 Web Audio API 合成简单音效，无需外部文件
// 触感反馈使用 navigator.vibrate()

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

// 简单的音符播放
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.15,
  delay: number = 0,
) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch {
    // Audio not available, silently fail
  }
}

// 噪声生成（用于警报类音效）
function playNoise(duration: number, volume: number = 0.08) {
  try {
    const ctx = getAudioCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // silently fail
  }
}

// 触感反馈
function vibrate(pattern: number | number[]) {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    // not supported
  }
}

// ====== 具体音效 ======

/** 按钮点击 - 轻柔的 "咔" */
export function sfxClick() {
  playTone(800, 0.08, 'sine', 0.1);
  playTone(1200, 0.05, 'sine', 0.06, 0.03);
  vibrate(10);
}

/** 选择确认 - 上升音阶 */
export function sfxSelect() {
  playTone(523, 0.1, 'sine', 0.12);
  playTone(659, 0.1, 'sine', 0.12, 0.08);
  playTone(784, 0.15, 'sine', 0.1, 0.16);
  vibrate(15);
}

/** 危机警报 - 低沉脉冲 */
export function sfxCrisisAlert() {
  playTone(220, 0.3, 'sawtooth', 0.1);
  playTone(200, 0.3, 'sawtooth', 0.08, 0.25);
  playNoise(0.15, 0.05);
  vibrate([30, 50, 30, 50, 60]);
}

/** 突发事件 - 急促双响 */
export function sfxBreaking() {
  playTone(880, 0.12, 'square', 0.08);
  playTone(880, 0.12, 'square', 0.08, 0.15);
  playTone(1100, 0.2, 'square', 0.06, 0.3);
  vibrate([40, 30, 40, 30, 80]);
}

/** 正面结果 - 明快上扬 */
export function sfxPositive() {
  playTone(523, 0.12, 'sine', 0.1);
  playTone(659, 0.12, 'sine', 0.1, 0.1);
  playTone(784, 0.12, 'sine', 0.1, 0.2);
  playTone(1047, 0.25, 'sine', 0.08, 0.3);
  vibrate(20);
}

/** 负面结果 - 低沉下坠 */
export function sfxNegative() {
  playTone(440, 0.15, 'sine', 0.1);
  playTone(370, 0.15, 'sine', 0.1, 0.12);
  playTone(311, 0.2, 'triangle', 0.08, 0.24);
  vibrate([20, 40, 30]);
}

/** 反转！ - 戏剧性转折 */
export function sfxTwist() {
  playTone(440, 0.1, 'sine', 0.1);
  playTone(440, 0.1, 'sine', 0.1, 0.1);
  playTone(440, 0.1, 'sine', 0.1, 0.2);
  playTone(554, 0.3, 'sine', 0.12, 0.35);
  vibrate([20, 30, 20, 30, 60]);
}

/** 天数切换 - 柔和过渡 */
export function sfxDayTransition() {
  playTone(392, 0.2, 'sine', 0.06);
  playTone(523, 0.3, 'sine', 0.05, 0.15);
}

/** 赚钱 - 金币叮 */
export function sfxMoney() {
  playTone(1318, 0.08, 'sine', 0.1);
  playTone(1568, 0.12, 'sine', 0.08, 0.06);
  playTone(2093, 0.15, 'sine', 0.06, 0.12);
}

/** 亏钱 - 沉闷落下 */
export function sfxMoneyLoss() {
  playTone(523, 0.1, 'triangle', 0.08);
  playTone(392, 0.15, 'triangle', 0.06, 0.08);
  playTone(262, 0.25, 'triangle', 0.05, 0.18);
}

/** 成就解锁 - 华丽 fanfare */
export function sfxAchievement() {
  playTone(523, 0.1, 'sine', 0.12);
  playTone(659, 0.1, 'sine', 0.12, 0.1);
  playTone(784, 0.1, 'sine', 0.12, 0.2);
  playTone(1047, 0.1, 'sine', 0.12, 0.3);
  playTone(1318, 0.35, 'sine', 0.1, 0.4);
  vibrate([20, 20, 20, 20, 50]);
}

/** 结局揭晓 - 史诗感 */
export function sfxEnding() {
  playTone(262, 0.3, 'sine', 0.1);
  playTone(330, 0.3, 'sine', 0.1, 0.25);
  playTone(392, 0.3, 'sine', 0.1, 0.5);
  playTone(523, 0.5, 'sine', 0.12, 0.75);
  vibrate([30, 50, 30, 50, 100]);
}

/** 灾难/崩溃 - 震撼坠落 */
export function sfxDisaster() {
  playTone(440, 0.2, 'sawtooth', 0.1);
  playTone(330, 0.2, 'sawtooth', 0.1, 0.15);
  playTone(220, 0.3, 'sawtooth', 0.1, 0.3);
  playTone(110, 0.5, 'sawtooth', 0.08, 0.5);
  playNoise(0.3, 0.06);
  vibrate([50, 30, 80, 30, 120]);
}

/** 来电铃声 - 模拟手机铃声（重复两组上升音阶） */
export function sfxPhoneRing() {
  // 第一组铃声
  playTone(880, 0.15, 'sine', 0.12);
  playTone(1100, 0.15, 'sine', 0.12, 0.15);
  playTone(880, 0.15, 'sine', 0.12, 0.35);
  playTone(1100, 0.15, 'sine', 0.12, 0.50);
  // 间隔后第二组
  playTone(880, 0.15, 'sine', 0.10, 0.80);
  playTone(1100, 0.15, 'sine', 0.10, 0.95);
  playTone(880, 0.15, 'sine', 0.10, 1.15);
  playTone(1100, 0.15, 'sine', 0.10, 1.30);
  vibrate([100, 80, 100, 80, 100, 80, 100, 80, 200]);
}

/** 挂断电话 - 短促下降音 */
export function sfxPhoneHangUp() {
  playTone(600, 0.1, 'sine', 0.1);
  playTone(400, 0.15, 'sine', 0.08, 0.08);
  playTone(250, 0.2, 'triangle', 0.06, 0.18);
  vibrate(30);
}
