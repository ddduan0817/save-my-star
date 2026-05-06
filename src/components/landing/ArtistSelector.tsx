'use client';

import { motion } from 'framer-motion';
import type { Artist } from '@/types/game';
import { cn, formatMoney } from '@/lib/utils';
import ArtistAvatarSVG from './ArtistAvatarSVG';

interface ArtistSelectorProps {
  artists: Artist[];
  onSelect: (id: string) => void;
}

/**
 * Sticker-card style artist picker. Each card looks like a hand-cut
 * "trading card" with a slight tilt, washi-tape header, and a colored
 * sticky-note accent. Designed to read as Xiaohongshu cover, not iOS list.
 */
const artistThemes: Record<string, {
  tagBg: string;        // small chip
  tagText: string;
  ringColor: string;
  tilt: string;         // base tilt class
}> = {
  idol: {
    tagBg: 'bg-[#FFD580]',
    tagText: 'text-[#7A4A00]',
    ringColor: 'ring-[#F5C77E]/60',
    tilt: '-rotate-[1.2deg]',
  },
  actor: {
    tagBg: 'bg-[#A9D0FF]',
    tagText: 'text-[#0F3F7A]',
    ringColor: 'ring-[#9CC4F2]/60',
    tilt: 'rotate-[0.8deg]',
  },
  singer: {
    tagBg: 'bg-[#D9B6F8]',
    tagText: 'text-[#5D2A85]',
    ringColor: 'ring-[#C9A6E8]/60',
    tilt: '-rotate-[0.6deg]',
  },
  influencer: {
    tagBg: 'bg-[#FFA8B2]',
    tagText: 'text-[#8B1F2E]',
    ringColor: 'ring-[#F5969F]/60',
    tilt: 'rotate-[1deg]',
  },
};

export default function ArtistSelector({ artists, onSelect }: ArtistSelectorProps) {
  return (
    <div className="space-y-4">
      {artists.map((artist, i) => {
        const theme = artistThemes[artist.id] || artistThemes.idol;
        return (
          <motion.button
            key={artist.id}
            initial={{ opacity: 0, y: 24, rotate: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.08, type: 'spring', stiffness: 180, damping: 20 }}
            whileHover={{ scale: 1.02, rotate: 0, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(artist.id)}
            className={cn(
              'relative w-full text-left rounded-[18px] bg-white ring-1 transition-shadow duration-300 overflow-visible',
              'shadow-[0_4px_0_-1px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(80,60,30,0.18)]',
              'hover:shadow-[0_6px_0_-1px_rgba(0,0,0,0.05),0_14px_28px_-10px_rgba(80,60,30,0.25)]',
              theme.ringColor,
              theme.tilt,
            )}
          >
            {/* washi tape on the top edge */}
            <span
              className="tape-top absolute inset-x-0 top-0 pointer-events-none"
              aria-hidden
            />

            <div className="p-4 pt-5">
              <div className="flex items-start gap-3.5">
                {/* Sticky-note avatar block — flat sticker SVG */}
                <div className={cn(
                  'relative w-16 h-16 rounded-[14px] flex items-center justify-center flex-shrink-0 overflow-hidden',
                  'shadow-[2px_2px_0_rgba(0,0,0,0.06)]',
                )}>
                  <ArtistAvatarSVG artistId={artist.id} size={64} />
                  {/* small folded-corner accent */}
                  <span
                    aria-hidden
                    className="absolute bottom-0 right-0 w-3 h-3 bg-white/60 z-10"
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-black text-[17px] text-gray-900 tracking-tight">
                      {artist.name}
                    </span>
                    <span className={cn(
                      'text-[10.5px] px-2 py-[1px] rounded-md font-bold',
                      theme.tagBg,
                      theme.tagText,
                    )}>
                      {artist.title}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 mb-3 leading-relaxed">
                    {artist.description}
                  </p>

                  {/* Stats — handwritten label + retro bar */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: '商业', value: artist.initialStats.commercialValue, barClass: 'bg-amber-400', track: 'bg-amber-100' },
                      { label: '粉丝', value: artist.initialStats.fanLoyalty, barClass: 'bg-pink-400', track: 'bg-pink-100' },
                      { label: '风险', value: artist.initialStats.prRisk, barClass: 'bg-rose-400', track: 'bg-rose-100' },
                      { label: '资金', value: null, barClass: '', track: '' },
                    ].map(stat => (
                      <div key={stat.label}>
                        <div className="text-[10px] text-gray-400 mb-1 font-medium">{stat.label}</div>
                        {stat.value !== null ? (
                          <div className={cn('h-1.5 rounded-full overflow-hidden', stat.track)}>
                            <div
                              className={cn('h-full rounded-full', stat.barClass)}
                              style={{ width: `${stat.value}%` }}
                            />
                          </div>
                        ) : (
                          <div className="text-[11px] font-black text-amber-600">
                            ¥{formatMoney(artist.initialStats.money)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Special trait — note with red marker */}
                  <div className="text-[11.5px] font-medium text-gray-700 leading-snug">
                    <span className="text-[#FF2E2E] font-black mr-1">★</span>
                    <span className="marker-yellow">{artist.specialTrait}</span>
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
