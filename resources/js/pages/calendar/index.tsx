import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, Mail, Phone, Building, MessageSquare, StickyNote, Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentReplyModal } from '@/components/AppointmentReplyModal';
import { toast } from '@/components/custom-toast';
import { debounce } from 'lodash';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  business: string | null;
  notes: string | null;
}

export default function CalendarPage() {
  const { t } = useTranslation();
  const { appointments, stats, dateRange, businesses } = usePage().props as { 
    appointments: Appointment[], 
    stats: { total: number, scheduled: number, confirmed: number, completed: number },
    dateRange: { start: string, end: string },
    businesses: { id: number, name: string }[]
  };
  
  const calendarRef = useRef<any>(null);
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  
  // Use pre-calculated stats from the backend
  const { total: totalCount, scheduled: scheduledCount, confirmed: confirmedCount, completed: completedCount } = stats;
  
  // Memoize appointment data for modal
  const modalAppointmentData = useMemo(() => selectedAppointment ? {
    ...selectedAppointment,
    appointment_date: selectedAppointment.date,
    appointment_time: selectedAppointment.time,
    business: selectedAppointment.business ? { name: selectedAppointment.business } : null
  } : null, [selectedAppointment]);
  
  // Memoize event handlers
  const handleCloseModal = useCallback(() => setIsReplyModalOpen(false), []);
  const handleSetMonthView = useCallback(() => setViewMode('month'), []);
  const handleSetAgendaView = useCallback(() => setViewMode('agenda'), []);
  
  // Handle calendar date range changes
  const handleDatesSet = useCallback(debounce((calendarInfo: any) => {
    const startDate = calendarInfo.startStr.split('T')[0];
    const endDate = calendarInfo.endStr.split('T')[0];
    
    // Only fetch if date range has changed significantly
    if (startDate !== dateRange.start || endDate !== dateRange.end) {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        // Always include business_id parameter, use 'all' for all businesses
        business_id: selectedBusinessId ? selectedBusinessId.toString() : 'all'
      });
      
      router.reload({
        only: ['appointments', 'stats', 'dateRange'],
        data: Object.fromEntries(params),
        onFinish: () => setIsLoading(false)
      });
    }
  }, 300), [dateRange, selectedBusinessId]);
  
  // Handle business filter change
  const handleBusinessChange = useCallback((businessId: number | null) => {
    setSelectedBusinessId(businessId);
    
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const startDate = calendarApi.view.activeStart.toISOString().split('T')[0];
      const endDate = calendarApi.view.activeEnd.toISOString().split('T')[0];
      
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        // Always include business_id parameter, use 'all' for all businesses
        business_id: businessId ? businessId.toString() : 'all'
      });
      
      setIsLoading(true);
      router.reload({
        only: ['appointments', 'stats', 'dateRange'],
        data: Object.fromEntries(params),
        onFinish: () => setIsLoading(false)
      });
    }
  }, []);

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Calendar') }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#3b82f6';
      case 'confirmed': return '#10b77f';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      case 'no_show': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Memoize events with virtualization for better performance
  const events = useMemo(() => {
    // Only process appointments that are in the visible range
    return appointments.map(appointment => {
      // Format for proper display in all views (month, week, day)
      const dateStr = appointment.date;
      const timeStr = appointment.time || '00:00';
      
      return {
        id: appointment.id.toString(),
        title: appointment.title,
        start: `${dateStr}T${timeStr}`,
        allDay: !appointment.time,
        backgroundColor: getEventColor(appointment.status),
        borderColor: getEventColor(appointment.status),
        extendedProps: {
          ...appointment
        }
      };
    });
  }, [appointments]);

  // Optimize appointment filtering with memoization
  const getAppointmentsForDate = useCallback((date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    // Use indexed access for better performance
    return appointments.filter(apt => apt.date === dateStr);
  }, [appointments]);

  const hasAppointments = useCallback((date: Date) => {
    return getAppointmentsForDate(date).length > 0;
  }, [getAppointmentsForDate]);

  // Memoize filtered appointments for selected date
  const selectedDateAppointments = useMemo(() => {
    if (!selectedDate || Array.isArray(selectedDate)) return [];
    return getAppointmentsForDate(selectedDate);
  }, [selectedDate, getAppointmentsForDate]);
  
  // Apply search filter separately to avoid unnecessary re-filtering
  const getSelectedDateAppointments = useCallback(() => {
    if (!searchQuery) return selectedDateAppointments;
    
    const query = searchQuery.toLowerCase();
    return selectedDateAppointments.filter(appointment => 
      (appointment.title?.toLowerCase() || '').includes(query) ||
      (appointment.email?.toLowerCase() || '').includes(query) ||
      (appointment.phone?.toLowerCase() || '').includes(query) ||
      (appointment.message?.toLowerCase() || '').includes(query) ||
      (appointment.business?.toLowerCase() || '').includes(query) ||
      (appointment.notes?.toLowerCase() || '').includes(query)
    );
  }, [selectedDateAppointments, searchQuery]);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasAppointments(date)) {
      const count = getAppointmentsForDate(date).length;
      return (
        <div className="flex justify-center mt-1">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          {count > 1 && (
            <span className="text-xs text-primary ml-1">{count}</span>
          )}
        </div>
      );
    }
    return null;
  };

  const formatTime = useCallback((time: string | null) => {
    if (!time) return '';
    return time;
  }, []);
  
  const handleAppointmentClick = useCallback((appointment: any) => {
    setSelectedAppointment(appointment);
    setIsReplyModalOpen(true);
  }, []);
  
  const handleReplySubmit = useCallback((data: { notes: string; status: string }) => {
    toast.loading(t('Sending reply...'));
    
    router.post(route("appointments.reply", selectedAppointment.id), data, {
      onSuccess: () => {
        setIsReplyModalOpen(false);
        toast.dismiss();
        toast.success(t('Reply sent successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to send reply: ${Object.values(errors).join(', ')}`);
      }
    });
  }, [selectedAppointment, t]);

  return (
    <PageTemplate 
      title={t("Calendar")} 
      url="/calendar"
      breadcrumbs={breadcrumbs}
      noPadding
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">{t('Appointment Calendar')}</h2>
            </div>
            <div className="flex gap-2">
              <div className="mr-2">
                <Select
                  value={selectedBusinessId?.toString() || 'all'}
                  onValueChange={(value) => handleBusinessChange(value !== 'all' ? parseInt(value) : null)}
                >
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue placeholder={t('All Businesses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('All Businesses')}</SelectItem>
                    {businesses.map((business) => (
                      <SelectItem key={business.id} value={business.id.toString()}>
                        {business.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={handleSetMonthView}
              >
                {t('Month View')}
              </Button>
              <Button
                variant={viewMode === 'agenda' ? 'default' : 'outline'}
                size="sm"
                onClick={handleSetAgendaView}
              >
                {t('Agenda View')}
              </Button>
            </div>
          </div>
        </div>



{/* Business Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className='h-full'>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {viewMode === 'month' ? t('Monthly Calendar') : t('Agenda View')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === 'month' ? (
                  <div className="fullcalendar-container">
                    <FullCalendar
                      ref={calendarRef}
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
                      firstDay={window.appSettings?.get ? (window.appSettings.get('calendarStartDay') === 'monday' ? 1 : 0) : 0}
                      headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                      }}
                      events={events}
                      height="auto"
                      eventClick={(info) => {
                        const date = new Date(info.event.startStr);
                        setSelectedDate(date);
                        const appointmentData = info.event.extendedProps;
                        handleAppointmentClick(appointmentData);
                      }}
                      dateClick={(info) => {
                        setSelectedDate(new Date(info.dateStr));
                      }}
                      dayMaxEventRows={2}
                      moreLinkText={t('more')}
                      moreLinkClick={(info) => {
                        setSelectedDate(info.date);
                        // Return popover and ensure it has scrolling
                        setTimeout(() => {
                          const popover = document.querySelector('.fc-popover-body');
                          if (popover) {
                            popover.classList.add('custom-scrollbar');
                          }
                        }, 10);
                        return 'popover';
                      }}
                      slotMinTime="06:00:00"
                    slotMaxTime="22:00:00"
                      allDaySlot={true}
                      allDayText={t('All day')}
                      slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        second: window.appSettings?.get('timeFormat', 'H:i').includes('s') ? '2-digit' : undefined,
                        hour12: window.appSettings?.get('timeFormat', 'H:i').includes('A') || window.appSettings?.get('timeFormat', 'H:i').includes('a')
                      }}
                      eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        second: window.appSettings?.get('timeFormat', 'H:i').includes('s') ? '2-digit' : undefined,
                        hour12: window.appSettings?.get('timeFormat', 'H:i').includes('A') || window.appSettings?.get('timeFormat', 'H:i').includes('a')
                      }}
                      lazyFetching={true}
                      datesSet={handleDatesSet}
                      loading={isLoading}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[569px] overflow-y-auto">
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {t('Loading appointments...')}
                      </div>
                    ) : appointments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {t('No appointments scheduled')}
                      </div>
                    ) : (
                      appointments
                        .slice(0, 50) // Limit to first 50 appointments for performance
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="border rounded-lg p-4 min-h-[120px] hover:bg-gray-50 hover:shadow-sm cursor-pointer transition-all duration-200"
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{appointment.title}</h4>
                                  <Badge className={getStatusColor(appointment.status)}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('_', ' ')}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div className="flex items-center gap-1 text-sm">
                                <CalendarIcon className="h-4 w-4 text-primary flex-shrink-0" />
                                <span>{window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(appointment.date, false) : new Date(appointment.date).toLocaleDateString()}</span>
                              </div>
                              {appointment.time && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span>{window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(`${appointment.date}T${appointment.time}`, true).split(' ').slice(1).join(' ') : appointment.time}</span>
                                </div>
                              )}
                              
                              {appointment.email && (
                                <div className="flex items-center gap-1 text-sm overflow-hidden">
                                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="truncate">{appointment.email}</span>
                                </div>
                              )}
                              
                              {appointment.phone && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span>{appointment.phone}</span>
                                </div>
                              )}
                            </div>
                            
                            {appointment.message && (
                              <div className="text-sm text-gray-600 line-clamp-2 mb-1">
                                <span className="font-medium">{t('Message')}:</span> {appointment.message}
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Appointment Details Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="h-5 w-5" />
                  {selectedDate && !Array.isArray(selectedDate) 
                    ? `${t('Appointments for')} ${window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(selectedDate, false) : selectedDate.toLocaleDateString()}`
                    : t('Select a Date')
                  }
                </CardTitle>
                {selectedDate && !Array.isArray(selectedDate) && selectedDateAppointments.length > 0 && (
                  <div className="mt-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder={t('Search appointments...')}
                        className="w-full rounded-md border border-input pl-8 pr-8 py-2 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-gray-100 flex items-center justify-center"
                          title={t('Clear search')}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="max-h-[425px] overflow-y-auto">
                {selectedDate && !Array.isArray(selectedDate) ? (
                  <div className="space-y-4">
                    {getSelectedDateAppointments().length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>
                          {searchQuery 
                            ? t('No appointments match your search') 
                            : t('No appointments on this date')}
                        </p>
                      </div>
                    ) : (
                      getSelectedDateAppointments()
                        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                        .map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-800">{appointment.title}</h4>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                              {appointment.time && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span>{window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(`${appointment.date}T${appointment.time}`, true).split(' ').slice(1).join(' ') : appointment.time}</span>
                                </div>
                              )}
                              
                              {appointment.email && (
                                <div className="flex items-center gap-2 text-sm overflow-hidden">
                                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="truncate">{appointment.email}</span>
                                </div>
                              )}
                              
                              {appointment.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-primary" />
                                  <span>{appointment.phone}</span>
                                </div>
                              )}
                              
                              {appointment.business && (
                                <div className="flex items-center gap-2 text-sm overflow-hidden">
                                  <Building className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="truncate">{appointment.business}</span>
                                </div>
                              )}
                            </div>
                            
                            {appointment.message && (
                              <div className="mb-3 bg-gray-50 p-2 rounded-md">
                                <div className="flex items-start gap-2 text-sm">
                                  <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
                                  <span className="text-gray-600">{appointment.message}</span>
                                </div>
                              </div>
                            )}
                            
                            {appointment.notes && (
                              <div className="mb-3 bg-blue-50 p-2 rounded-md">
                                <div className="flex items-start gap-2 text-sm">
                                  <StickyNote className="h-4 w-4 text-blue-500 mt-0.5" />
                                  <span className="text-gray-700">{appointment.notes}</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                              <Button 
                                size="sm"
                                className="gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAppointmentClick(appointment);
                                }}
                              >
                                <MessageSquare className="h-4 w-4" />
                                {t('Reply')}
                              </Button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>{t('Click on a date to view appointments')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-semibold'>{t('Quick Stats')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('Total Appointments')}</span>
                    <span className="font-medium">{totalCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('Scheduled')}</span>
                    <span className="font-medium text-blue-600">
                      {scheduledCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('Confirmed')}</span>
                    <span className="font-medium text-green-600">
                      {confirmedCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('Completed')}</span>
                    <span className="font-medium text-gray-600">
                      {completedCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      <AppointmentReplyModal
        isOpen={isReplyModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleReplySubmit}
        appointment={modalAppointmentData}
      />
      
      <style jsx="true" global="true">{`
        .fullcalendar-container .fc {
          font-family: inherit;
        }
        
        .fullcalendar-container .fc-toolbar {
          margin-bottom: 1rem;
        }
        
        .fullcalendar-container .fc-button {
          background: none;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 0.5rem;
          border-radius: 0.375rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .fullcalendar-container .fc-button:hover {
          background-color: #f3f4f6 !important;
          border-color: #9ca3af !important;
        }
        
        .fullcalendar-container .fc-button:not(.fc-button-active):hover {
          background-color: #f3f4f6 !important;
          color: #374151 !important;
        }
        
        .fullcalendar-container .fc-button:focus {
          box-shadow: none;
        }
        
        .fullcalendar-container .fc-button-primary {
          background-color: #f3f4f6;
        }
        
        .fullcalendar-container .fc-today-button {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: white !important;
          text-transform: capitalize;
        }
        
        .fullcalendar-container .fc-today-button:hover {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: white !important;
          opacity: 0.9;
        }
        
        .fullcalendar-container .fc-button-active {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: white !important;
        }
        
        .fullcalendar-container .fc-button-active:hover {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: white !important;
          opacity: 0.9;
        }
        
        .fullcalendar-container .fc-daygrid-day {
          cursor: pointer;
        }
        
        .fullcalendar-container .fc-daygrid-day:hover {
          background-color: #f9fafb;
        }
        
        .fullcalendar-container .fc-daygrid-more-link {
          background-color: #f3f4f6;
          border-radius: 0.25rem;
          padding: 0.125rem 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #4b5563;
        }
        
        .fullcalendar-container .fc-view-harness.fc-view-harness-active {
          min-height: 500px;
          height: calc(100vh - 300px) !important;
        }
        
        .fullcalendar-container .fc-view-harness.fc-view-harness-active.fc-loading {
          opacity: 0.7;
          position: relative;
        }
        
        .fullcalendar-container .fc-view-harness.fc-view-harness-active.fc-loading:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.7);
          z-index: 10;
        }
        
        .fullcalendar-container .fc-daygrid-more-link:hover {
          background-color: #e5e7eb;
          color: #111827;
          text-decoration: none;
        }
        
        .fullcalendar-container .fc-event {
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          font-size: 0.75rem;
          border: none;
        }
        
        .fullcalendar-container .fc-event-title {
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .fullcalendar-container .fc-daygrid-event {
          background-color: var(--fc-event-bg-color);
          color: white;
        }
        
        .fullcalendar-container .fc-daygrid-dot-event {
          background-color: var(--fc-event-bg-color);
        }
        
        .fullcalendar-container .fc-day-today {
          background-color: rgba(99, 102, 241, 0.05) !important;
        }
        
        /* Add scrolling to popover */
        .fullcalendar-container .fc-popover-body {
          max-height: 250px;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        
        .fullcalendar-container .fc-popover {
          max-width: 300px;
        }
        
        /* Ensure all buttons have consistent styling */
        .fullcalendar-container .fc-prev-button,
        .fullcalendar-container .fc-next-button,
        .fullcalendar-container .fc-dayGridMonth-button,
        .fullcalendar-container .fc-timeGridWeek-button,
        .fullcalendar-container .fc-timeGridDay-button {
          text-transform: capitalize !important;
        }
        
        .fullcalendar-container .fc-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .fullcalendar-container .fc-button:disabled:hover {
          background-color: transparent !important;
          border-color: #d1d5db !important;
          color: #374151 !important;
        }
      `}</style>
    </PageTemplate>
  );
}