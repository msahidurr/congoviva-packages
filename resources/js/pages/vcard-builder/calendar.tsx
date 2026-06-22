import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Mail, Phone, Building, MessageSquare, StickyNote, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentReplyModal } from '@/components/AppointmentReplyModal';
import { toast } from '@/components/custom-toast';

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

interface Business {
  id: number;
  name: string;
}

export default function VCardCalendarPage() {
  const { t } = useTranslation();
  const { appointments = [], business = null, selectedBusinessId = '' } = usePage().props as { 
    appointments?: Appointment[], 
    business?: any,
    selectedBusinessId?: string
  };
  
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('vCard Builder'), href: route('vcard-builder.index') },
    { title: business?.name || t('Business') },
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

  const events = appointments.map(appointment => {
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

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const hasAppointments = (date: Date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  const selectedDateAppointments = selectedDate && !Array.isArray(selectedDate) ? getAppointmentsForDate(selectedDate) : [];
  
  const getSelectedDateAppointments = () => {
    if (!searchQuery) return selectedDateAppointments;
    
    const query = searchQuery.toLowerCase();
    return selectedDateAppointments.filter(appointment => 
      appointment.title?.toLowerCase().includes(query) ||
      appointment.email?.toLowerCase().includes(query) ||
      appointment.phone?.toLowerCase().includes(query) ||
      appointment.message?.toLowerCase().includes(query) ||
      appointment.business?.toLowerCase().includes(query) ||
      appointment.notes?.toLowerCase().includes(query)
    );
  };

  const formatTime = (time: string | null) => {
    if (!time) return '';
    return time;
  };
  
  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsReplyModalOpen(true);
  };
  
  const handleReplySubmit = (data: { notes: string; status: string }) => {
    toast.loading(t('Sending reply...'));
    
    router.post(route("appointments.reply", [selectedBusinessId, selectedAppointment.id]), data, {
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
  };

  return (
    <PageTemplate 
      title={t("Business Appointment")} 
      url={route('vcard-builder.calendar', selectedBusinessId)}
      breadcrumbs={breadcrumbs}
      noPadding
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">{business?.name ? `${business.name} - ${t('Calendar')}` : t('Business Calendar')}</h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                {t('Month View')}
              </Button>
              <Button
                variant={viewMode === 'agenda' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('agenda')}
              >
                {t('Agenda View')}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {viewMode === 'month' ? t('Monthly Calendar') : t('Agenda View')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === 'month' ? (
                  <div className="fullcalendar-container">
                    <FullCalendar
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
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
                        // Get the appointment data from the event's extendedProps
                        const appointmentData = info.event.extendedProps;
                        handleAppointmentClick(appointmentData);
                      }}
                      dateClick={(info) => {
                        setSelectedDate(new Date(info.dateStr));
                      }}
                      dayMaxEventRows={2}
                      moreLinkText={t('more')}
                      moreLinkClick={(info) => {
                        // Set the selected date to show appointments in the sidebar
                        setSelectedDate(info.date);
                        return 'popover';
                      }}
                      slotMinTime="06:00:00"
                      slotMaxTime="22:00:00"
                      allDaySlot={true}
                      allDayText={t('All day')}
                      slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }}
                      eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {appointments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {t('No appointments scheduled')}
                      </div>
                    ) : (
                      appointments
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
                                <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              </div>
                              {appointment.time && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span>{formatTime(appointment.time)}</span>
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
                                <span className="font-medium">Message:</span> {appointment.message}
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
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {selectedDate && !Array.isArray(selectedDate) 
                    ? `${t('Appointments for')} ${selectedDate.toLocaleDateString()}`
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
                                  <span>{formatTime(appointment.time)}</span>
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
                <CardTitle>{t('Quick Stats')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('Total Appointments')}</span>
                    <span className="font-medium">{appointments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('Scheduled')}</span>
                    <span className="font-medium text-blue-600">
                      {appointments.filter(a => a.status === 'scheduled').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('Confirmed')}</span>
                    <span className="font-medium text-green-600">
                      {appointments.filter(a => a.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('Completed')}</span>
                    <span className="font-medium text-gray-600">
                      {appointments.filter(a => a.status === 'completed').length}
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
        onClose={() => setIsReplyModalOpen(false)}
        onSubmit={handleReplySubmit}
        appointment={selectedAppointment ? {
          ...selectedAppointment,
          appointment_date: selectedAppointment.date,
          appointment_time: selectedAppointment.time,
          business: selectedAppointment.business ? { name: selectedAppointment.business } : null
        } : null}
      />
      
      <style>{`
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