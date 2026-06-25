import React, { useState } from 'react';
import ArrivalStatusBadge from './ArrivalStatusBadge';
import { Check, X } from 'lucide-react';

interface Guest {
  first_name: string;
  last_name: string;
  table: string;
  seat?: string;
  arrived_at?: string;
  is_arrived: boolean;
}

interface GuestArrivalTableProps {
  guests: Guest[];
  eventId: number;
  onStatusChange?: (guest: Guest, newStatus: boolean) => void;
  isLoading?: boolean;
}

export default function GuestArrivalTable({
  guests,
  eventId,
  onStatusChange,
  isLoading = false
}: GuestArrivalTableProps) {
  const [localGuests, setLocalGuests] = useState<Guest[]>(guests);
  const [updatingGuest, setUpdatingGuest] = useState<string | null>(null);

  const handleToggleArrival = async (guest: Guest) => {
    setUpdatingGuest(`${guest.first_name}-${guest.last_name}-${guest.table}`);
    
    try {
      const endpoint = guest.is_arrived 
        ? `/api/events/${eventId}/guest-arrivals/mark-not-arrived`
        : `/api/events/${eventId}/guest-arrivals/mark-arrived`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          first_name: guest.first_name,
          last_name: guest.last_name,
          table_number: guest.table
        })
      });

      if (response.ok) {
        const updatedGuest = {
          ...guest,
          is_arrived: !guest.is_arrived,
          arrived_at: !guest.is_arrived ? new Date().toISOString() : undefined
        };
        
        setLocalGuests(prev => 
          prev.map(g => 
            g.first_name === guest.first_name && 
            g.last_name === guest.last_name && 
            g.table === guest.table
              ? updatedGuest
              : g
          )
        );

        onStatusChange?.(updatedGuest, !guest.is_arrived);
      }
    } catch (error) {
      console.error('[v0] Error toggling arrival:', error);
    } finally {
      setUpdatingGuest(null);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Guest Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Table</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Seat</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Arrived Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {localGuests.map((guest, index) => {
              const guestKey = `${guest.first_name}-${guest.last_name}-${guest.table}`;
              const isUpdating = updatingGuest === guestKey;
              
              return (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <ArrivalStatusBadge 
                      isArrived={guest.is_arrived}
                      arrivedAt={guest.arrived_at}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {guest.first_name} {guest.last_name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{guest.table}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{guest.seat || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{formatTime(guest.arrived_at)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleArrival(guest)}
                      disabled={isUpdating || isLoading}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                        guest.is_arrived
                          ? 'bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50'
                          : 'bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50'
                      }`}
                      title={guest.is_arrived ? 'Mark as not arrived' : 'Mark as arrived'}
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : guest.is_arrived ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {localGuests.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">No guests added yet</p>
        </div>
      )}
    </div>
  );
}
