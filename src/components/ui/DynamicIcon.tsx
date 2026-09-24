import React from 'react';
import { 
  AlertTriangle, 
  Camera, 
  Flame, 
  Heart, 
  Briefcase, 
  Mic, 
  Film, 
  Newspaper,
  PartyPopper,
  Swords,
  Coins,
  Smile,
  Frown,
  Skull,
  Star,
  Award,
  CircleAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicIconProps {
  emoji: string;
  className?: string;
  size?: number;
}

// POC Emoji to SVG map with polished UI styles
const EMOJI_TO_LUCIDE: Record<string, { icon: React.FC<any>, bg: string, color: string, border: string }> = {
  '🚨': { icon: AlertTriangle, bg: 'bg-gradient-to-br from-red-50 to-red-100', color: 'text-red-600', border: 'border-red-200/60' },
  '🔥': { icon: Flame, bg: 'bg-gradient-to-br from-orange-50 to-orange-100', color: 'text-orange-500', border: 'border-orange-200/60' },
  '📸': { icon: Camera, bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100', color: 'text-indigo-600', border: 'border-indigo-200/60' },
  '🎤': { icon: Mic, bg: 'bg-gradient-to-br from-purple-50 to-purple-100', color: 'text-purple-600', border: 'border-purple-200/60' },
  '🎬': { icon: Film, bg: 'bg-gradient-to-br from-slate-50 to-slate-100', color: 'text-slate-600', border: 'border-slate-200/60' },
  '💰': { icon: Coins, bg: 'bg-gradient-to-br from-amber-50 to-yellow-100', color: 'text-yellow-600', border: 'border-yellow-200/60' },
  '💣': { icon: CircleAlert, bg: 'bg-gradient-to-br from-red-800 to-red-950', color: 'text-red-50', border: 'border-red-900' },
  '🎭': { icon: PartyPopper, bg: 'bg-gradient-to-br from-fuchsia-50 to-fuchsia-100', color: 'text-fuchsia-600', border: 'border-fuchsia-200/60' },
  '💀': { icon: Skull, bg: 'bg-gradient-to-br from-zinc-700 to-zinc-900', color: 'text-zinc-200', border: 'border-zinc-700' },
  '👑': { icon: Award, bg: 'bg-gradient-to-br from-amber-100 to-yellow-200', color: 'text-amber-700', border: 'border-amber-300/60' },
  '💖': { icon: Heart, bg: 'bg-gradient-to-br from-pink-50 to-pink-100', color: 'text-pink-500', border: 'border-pink-200/60' },
  '💼': { icon: Briefcase, bg: 'bg-gradient-to-br from-blue-50 to-blue-100', color: 'text-blue-600', border: 'border-blue-200/60' },
  '📰': { icon: Newspaper, bg: 'bg-gradient-to-br from-sky-50 to-sky-100', color: 'text-sky-600', border: 'border-sky-200/60' },
  '⚔️': { icon: Swords, bg: 'bg-gradient-to-br from-rose-50 to-red-100', color: 'text-red-600', border: 'border-red-200/60' },
  '✨': { icon: Star, bg: 'bg-gradient-to-br from-amber-50 to-amber-100', color: 'text-amber-500', border: 'border-amber-200/60' },
  '👿': { icon: Frown, bg: 'bg-gradient-to-br from-violet-50 to-purple-100', color: 'text-purple-600', border: 'border-purple-200/60' },
  '👺': { icon: Frown, bg: 'bg-gradient-to-br from-red-50 to-red-100', color: 'text-red-600', border: 'border-red-200/60' },
  // Common UI emojis used in MessagesTab
  '👋': { icon: Smile, bg: 'bg-gradient-to-br from-amber-50 to-orange-100', color: 'text-orange-500', border: 'border-orange-200/60' },
  '📭': { icon: Newspaper, bg: 'bg-gradient-to-br from-gray-50 to-gray-100', color: 'text-gray-400', border: 'border-gray-200/60' },
  '🌧️': { icon: Heart, bg: 'bg-gradient-to-br from-blue-50 to-cyan-100', color: 'text-cyan-600', border: 'border-cyan-200/60' }, // For seasonal modifier example
  '☀️': { icon: Flame, bg: 'bg-gradient-to-br from-amber-50 to-yellow-100', color: 'text-amber-500', border: 'border-amber-200/60' },
};

export default function DynamicIcon({ emoji, className, size = 20 }: DynamicIconProps) {
  // If the environment is set to use native emojis (e.g. for offline H5 strict mode)
  // or if the emoji is not mapped, we fallback to native text emoji.
  const useNativeEmoji = process.env.NEXT_PUBLIC_USE_EMOJI === 'true';
  const mapping = EMOJI_TO_LUCIDE[emoji];

  if (useNativeEmoji || !mapping) {
    // Fallback for emojis we haven't mapped yet or when native is forced
    return (
      <div 
        className={cn(
          "flex items-center justify-center rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200/50 shadow-sm", 
          className
        )} 
        style={{ width: size * 1.8, height: size * 1.8 }}
      >
        <span style={{ fontSize: size, lineHeight: 1 }}>{emoji}</span>
      </div>
    );
  }

  const { icon: Icon, bg, color, border } = mapping;

  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-xl shadow-sm border", 
        bg, 
        border,
        className
      )} 
      style={{ width: size * 1.8, height: size * 1.8 }}
    >
      <Icon size={size} className={cn(color, "drop-shadow-sm")} strokeWidth={2.5} />
    </div>
  );
}
