'use client';

import { motion } from 'framer-motion';
import type { GameMessage } from '@/types/game';
import { cn } from '@/lib/utils';
import { CATEGORY_LABEL } from '@/data/constants';

interface MessageRowProps {
  message: GameMessage;
  index: number;
  onOpen: (id: string) => void;
}

export default function MessageRow({ message, index, onOpen }: MessageRowProps) {
  const { event, status, isUrgent } = message;
  const isResolved = status === 'resolved';

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2, ease: 'easeOut' }}
      onClick={() => !isResolved && onOpen(message.id)}
      disabled={isResolved}
      className={cn(
        "w-full text-left px-4 py-3.5 flex items-center gap-3 border-b border-gray-100/60 transition-all duration-200",
        isResolved
          ? "opacity-50"
          : "hover:bg-gray-50/60 active:bg-gray-100/40",
      )}
    >
      {/* Urgency / category indicator */}
      <div className="shrink-0 relative">
        <span className="text-xl">{event.emoji}</span>
        {isUrgent && !isResolved && (
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-semibold truncate",
            isResolved ? "text-gray-400" : "text-gray-800",
          )}>
            {event.title}
          </span>
          {isUrgent && !isResolved && (
            <span className="shrink-0 text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
              紧急
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={cn(
            "text-[10px] font-medium",
            event.category === 'crisis' ? "text-red-400"
              : event.category === 'business' ? "text-amber-500"
              : "text-gray-400"
          )}>
            {CATEGORY_LABEL[event.category]}
          </span>
          <span className="text-gray-200">·</span>
          <span className="text-[10px] text-gray-400 truncate">{event.description}</span>
        </div>
      </div>

      {/* Status */}
      <div className="shrink-0">
        {isResolved ? (
          <span className="text-[10px] text-gray-300 font-medium bg-gray-100 px-2 py-0.5 rounded-full">已处理</span>
        ) : status === 'unread' ? (
          <span className="w-2 h-2 bg-orange-400 rounded-full block" />
        ) : (
          <span className="text-gray-300 text-sm">›</span>
        )}
      </div>
    </motion.button>
  );
}
