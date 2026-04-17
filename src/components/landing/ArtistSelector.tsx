'use client';

import { motion } from 'framer-motion';
import type { Artist } from '@/types/game';
import { cn, formatMoney } from '@/lib/utils';

interface ArtistSelectorProps {
  artists: Artist[];
  onSelect: (id: string) => void;
}

export default function ArtistSelector({ artists, onSelect }: ArtistSelectorProps) {
  return (
    <div className="space-y-3">
      {artists.map((artist, i) => (
        <motion.button
          key={artist.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          onClick={() => onSelect(artist.id)}
          className="w-full text-left p-4 rounded-2xl border border-white/10 bg-[#141420] hover:bg-[#1a1a2e] hover:border-white/20 transition-all active:scale-[0.98]"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl">{artist.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white">{artist.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#8888aa]">
                  {artist.title}
                </span>
              </div>
              <p className="text-xs text-[#8888aa] mb-2.5">{artist.description}</p>

              {/* Stats preview */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[
                  { label: '商业', value: artist.initialStats.commercialValue, color: 'bg-amber-500' },
                  { label: '粉丝', value: artist.initialStats.fanLoyalty, color: 'bg-pink-500' },
                  { label: '风险', value: artist.initialStats.prRisk, color: 'bg-red-500' },
                  { label: '资金', value: null, color: '' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-[10px] text-[#8888aa] mb-0.5">{stat.label}</div>
                    {stat.value !== null ? (
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", stat.color)}
                          style={{ width: `${stat.value}%` }}
                        />
                      </div>
                    ) : (
                      <div className="text-[10px] font-medium text-amber-400">
                        ¥{formatMoney(artist.initialStats.money)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-amber-400/80 flex items-center gap-1">
                ✨ {artist.specialTrait}
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
