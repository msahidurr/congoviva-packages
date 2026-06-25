import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';
import ArrivalStatusBadge from '../components/ArrivalStatusBadge';

interface Guest {
  first_name: string;
  last_name: string;
  table: string;
  seat?: string;
}

interface PageProps {
  event: {
    id: number;
    name: string;
    slug: string;
    config_sections: any;
  };
  guestsList: Guest[];
  arrivedGuests: any;
}

export default function GuestCheckIn({ event, guestsList, arrivedGuests }: PageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [checkedInGuests, setCheckedInGuests] = useState<Set<string>>(
    new Set(
      Object.values(arrivedGuests).map((arrival: any) => 
        `${arrival.first_name}-${arrival.last_name}-${arrival.table_number}`
      )
    )
  );
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredGuests = guestsList.filter(guest => {
    const fullName = `${guest.first_name} ${guest.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || guest.table.includes(query);
  });

  const handleCheckIn = async (guest: Guest) => {
    setIsLoading(true);
    const guestKey = `${guest.first_name}-${guest.last_name}-${guest.table}`;
    
    try {
      const isAlreadyCheckedIn = checkedInGuests.has(guestKey);
      const endpoint = isAlreadyCheckedIn ? '/check-in/undo' : '/check-in';

      const response = await fetch(`/event/${event.slug}${endpoint}`, {
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
        if (isAlreadyCheckedIn) {
          setCheckedInGuests(prev => {
            const newSet = new Set(prev);
            newSet.delete(guestKey);
            return newSet;
          });
          setMessage({ type: 'success', text: t('Check-in undone successfully') });
        } else {
          setCheckedInGuests(prev => new Set(prev).add(guestKey));
          setMessage({ type: 'success', text: t('Guest checked in successfully') });
        }
        
        setTimeout(() => {
          setMessage(null);
          setSelectedGuest(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: t('Failed to check in guest') });
      }
    } catch (error) {
      console.error('[v0] Check-in error:', error);
      setMessage({ type: 'error', text: t('An error occurred during check-in') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {event.name}
          </h1>
          <p className="text-gray-600">{t('Guest Check-In')}</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('Search by name or table number...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Guests List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredGuests.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                {searchQuery ? t('No guests found') : t('No guests to display')}
              </p>
            ) : (
              filteredGuests.map((guest, index) => {
                const guestKey = `${guest.first_name}-${guest.last_name}-${guest.table}`;
                const isCheckedIn = checkedInGuests.has(guestKey);
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedGuest(guest)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedGuest?.first_name === guest.first_name && 
                      selectedGuest?.last_name === guest.last_name &&
                      selectedGuest?.table === guest.table
                        ? 'border-blue-500 bg-blue-50'
                        : isCheckedIn
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <ArrivalStatusBadge isArrived={isCheckedIn} />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {guest.first_name} {guest.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t('Table')} {guest.table} {guest.seat && `• {t('Seat')} ${guest.seat}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {isCheckedIn ? (
                          <span className="text-green-600">{t('Arrived')}</span>
                        ) : (
                          <span className="text-amber-600">{t('Pending')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Confirmation Section */}
        {selectedGuest && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Confirm Check-In')}</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-600 mb-2">{t('Guest Name')}</p>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                {selectedGuest.first_name} {selectedGuest.last_name}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('Table')}</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedGuest.table}</p>
                </div>
                {selectedGuest.seat && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('Seat')}</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedGuest.seat}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedGuest(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={() => handleCheckIn(selectedGuest)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('Processing...') : t('Mark as Arrived')}
              </button>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 text-sm mb-1">{t('Total Guests')}</p>
            <p className="text-2xl font-bold text-gray-900">{guestsList.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow border border-green-200">
            <p className="text-gray-600 text-sm mb-1">{t('Arrived')}</p>
            <p className="text-2xl font-bold text-green-600">{checkedInGuests.size}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 shadow border border-amber-200">
            <p className="text-gray-600 text-sm mb-1">{t('Pending')}</p>
            <p className="text-2xl font-bold text-amber-600">{guestsList.length - checkedInGuests.size}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
