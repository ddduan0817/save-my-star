'use client';

import { motion } from 'framer-motion';
import type { Artist } from '@/types/game';
import { cn, formatMoney } from '@/lib/utils';
import { artistAvatarMap } from '@/components/icons';

interface ArtistSelectorProps {
  artists: Artist[];
  onSelect: (id: string) => void;
}

export default function ArtistSelector({ artists, onSelect }: ArtistSelectorProps) {
  return (
    <div className="space-y-3.5">
      {artists.map((artist, i) => (
        <motion.button
          key={artist.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.975 }}
          onClick={() => onSelect(artist.id)}
          className="w-full text-left p-4 rounded-3xl bg-white/90 ring-1 ring-gray-200/50 hover:ring-orange-300/60 hover:shadow-xl hover:shadow-orange-100/30 transition-all duration-300 shadow-md shadow-gray-100/30"
        >
          <div className="flex items-start gap-3.5">
            <motion.div
              className="mt-0.5"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              {(() => { const Avatar = artistAvatarMap[artist.id]; return Avatar ? <Avatar size={44} /> : artist.avatar; })()}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-bold text-gray-800">{artist.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 text-gray-400 font-medium">
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

              <div className="text-[11px] text-orange-400 font-medium flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-orange-400" />
                {artist.specialTrait}
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
