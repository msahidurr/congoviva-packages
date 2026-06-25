import React from 'react';
import { Users, CheckCircle2, Clock } from 'lucide-react';

interface GuestArrivalStatsProps {
  total: number;
  arrived: number;
  pending: number;
}

export default function GuestArrivalStats({
  total,
  arrived,
  pending
}: GuestArrivalStatsProps) {
  const arrivedPercentage = total > 0 ? Math.round((arrived / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* Total Guests */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Guests</p>
            <p className="text-2xl font-semibold text-gray-900">{total}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Arrived */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Arrived</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-green-600">{arrived}</p>
              <p className="text-sm text-gray-500">({arrivedPercentage}%)</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${arrivedPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-semibold text-amber-600">{pending}</p>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
