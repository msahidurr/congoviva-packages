import React from 'react';
import { Check, Circle } from 'lucide-react';

interface ArrivalStatusBadgeProps {
  isArrived: boolean;
  arrivedAt?: string;
  showTimestamp?: boolean;
}

export default function ArrivalStatusBadge({
  isArrived,
  arrivedAt,
  showTimestamp = false
}: ArrivalStatusBadgeProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isArrived) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
        </div>
        {showTimestamp && arrivedAt && (
          <span className="text-xs text-gray-600">
            {formatTime(arrivedAt)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
      {showTimestamp && (
        <span className="text-xs text-gray-400">Pending</span>
      )}
    </div>
  );
}
