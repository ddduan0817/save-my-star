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
          className="w-full text-left p-4 rounded-2xl bg-white ring-1 ring-gray-200 hover:ring-orange-300 hover:shadow-md transition-all active:scale-[0.98] shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl">{artist.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-800">{artist.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                  {artist.title}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2.5">{artist.description}</p>

              {/* Stats preview */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[
                  { label: '商业', value: artist.initialStats.commercialValue, color: 'bg-amber-400', track: 'bg-amber-100' },
                  { label: '粉丝', value: artist.initialStats.fanLoyalty, color: 'bg-pink-400', track: 'bg-pink-100' },
                  { label: '风险', value: artist.initialStats.prRisk, color: 'bg-red-400', track: 'bg-red-100' },
                  { label: '资金', value: null, color: '', track: '' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-[10px] text-gray-400 mb-0.5">{stat.label}</div>
                    {stat.value !== null ? (
                      <div className={cn("h-1 rounded-full overflow-hidden", stat.track)}>
                        <div
                          className={cn("h-full rounded-full", stat.color)}
                          style={{ width: `${stat.value}%` }}
                        />
                      </div>
                    ) : (
                      <div className="text-[10px] font-semibold text-amber-600">
                        ¥{formatMoney(artist.initialStats.money)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-orange-500 font-medium">
                {artist.specialTrait}
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
