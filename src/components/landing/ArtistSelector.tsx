'use client';

import { motion } from 'framer-motion';
import type { Artist } from '@/types/game';
import { cn, formatMoney } from '@/lib/utils';

interface ArtistSelectorProps {
  artists: Artist[];
  onSelect: (id: string) => void;
}

const artistThemes: Record<string, {
  gradient: string;
  ring: string;
  avatarBg: string;
  accentText: string;
  tagBg: string;
}> = {
  idol: {
    gradient: 'from-orange-400 to-amber-400',
    ring: 'hover:ring-orange-300/60',
    avatarBg: 'bg-gradient-to-br from-orange-100 to-amber-50',
    accentText: 'text-orange-500',
    tagBg: 'bg-orange-50 text-orange-500',
  },
  actor: {
    gradient: 'from-blue-400 to-indigo-400',
    ring: 'hover:ring-blue-300/60',
    avatarBg: 'bg-gradient-to-br from-blue-100 to-indigo-50',
    accentText: 'text-blue-500',
    tagBg: 'bg-blue-50 text-blue-500',
  },
  singer: {
    gradient: 'from-purple-400 to-pink-400',
    ring: 'hover:ring-purple-300/60',
    avatarBg: 'bg-gradient-to-br from-purple-100 to-pink-50',
    accentText: 'text-purple-500',
    tagBg: 'bg-purple-50 text-purple-500',
  },
  influencer: {
    gradient: 'from-rose-400 to-red-400',
    ring: 'hover:ring-rose-300/60',
    avatarBg: 'bg-gradient-to-br from-rose-100 to-red-50',
    accentText: 'text-rose-500',
    tagBg: 'bg-rose-50 text-rose-500',
  },
};

export default function ArtistSelector({ artists, onSelect }: ArtistSelectorProps) {
  return (
    <div className="space-y-3.5">
      {artists.map((artist, i) => {
        const theme = artistThemes[artist.id] || artistThemes.idol;
        return (
          <motion.button
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.975 }}
            onClick={() => onSelect(artist.id)}
            className={cn(
              "w-full text-left rounded-3xl bg-white/90 ring-1 ring-gray-200/50 hover:shadow-xl transition-all duration-300 shadow-md shadow-gray-100/30 overflow-hidden",
              theme.ring,
            )}
          >
            <div className="p-4">
              <div className="flex items-start gap-3.5">
                {/* Avatar area - bigger, with themed background */}
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
                  theme.avatarBg,
                )}>
                  <motion.span
                    className="text-3xl"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {artist.avatar}
                  </motion.span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold text-gray-800">{artist.name}</span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      theme.tagBg,
                    )}>
                      {artist.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 leading-relaxed">{artist.description}</p>

                  {/* Stats preview */}
                  <div className="grid grid-cols-4 gap-2.5 mb-2.5">
                    {[
                      { label: '商业', value: artist.initialStats.commercialValue, barClass: 'stat-bar-amber', track: 'bg-amber-100/50' },
                      { label: '粉丝', value: artist.initialStats.fanLoyalty, barClass: 'stat-bar-pink', track: 'bg-pink-100/50' },
                      { label: '风险', value: artist.initialStats.prRisk, barClass: 'stat-bar-red', track: 'bg-red-100/50' },
                      { label: '资金', value: null, barClass: '', track: '' },
                    ].map(stat => (
                      <div key={stat.label}>
                        <div className="text-[10px] text-gray-300 mb-1">{stat.label}</div>
                        {stat.value !== null ? (
                          <div className={cn("h-1.5 rounded-full overflow-hidden", stat.track)}>
                            <div
                              className={cn("h-full rounded-full", stat.barClass)}
                              style={{ width: `${stat.value}%` }}
                            />
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold text-amber-500">
                            ¥{formatMoney(artist.initialStats.money)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={cn("text-[11px] font-medium flex items-center gap-1", theme.accentText)}>
                    <span className={cn("inline-block w-1 h-1 rounded-full", theme.accentText.replace('text-', 'bg-'))} />
                    {artist.specialTrait}
                  </div>
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
