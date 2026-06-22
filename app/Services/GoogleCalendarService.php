<?php

namespace App\Services;

use App\Models\Setting;
use Spatie\GoogleCalendar\Event;
use Carbon\Carbon;

class GoogleCalendarService
{
    public function createEvent($appointment)
    {
        if (!$this->isEnabled()) {
            return null;
        }

        try {
            $this->configureCalendar();
            
            $event = new Event;
            $event->name = 'Appointment: ' . $appointment->name;
            $event->description = $appointment->email . "\n" . $appointment->phone;
            // Parse appointment date and time correctly
            $appointmentDate = Carbon::parse($appointment->appointment_date)->format('Y-m-d');
            $appointmentTime = is_string($appointment->appointment_time) 
                ? $appointment->appointment_time 
                : Carbon::parse($appointment->appointment_time)->format('H:i:s');
            
            $event->startDateTime = Carbon::parse($appointmentDate . ' ' . $appointmentTime);
            $event->endDateTime = Carbon::parse($appointmentDate . ' ' . $appointmentTime)->addHour();
            
            return $event->save();
        } catch (\Exception $e) {
            \Log::error('Google Calendar error: ' . $e->getMessage());
            return null;
        }
    }

    public function updateEvent($eventId, $appointment)
    {
        if (!$this->isEnabled()) {
            return null;
        }

        try {
            $this->configureCalendar();
            
            $event = Event::find($eventId);
            if ($event) {
                $event->name = 'Appointment: ' . $appointment->name;
                $event->description = $appointment->email . "\n" . $appointment->phone;
                // Parse appointment date and time correctly
                $appointmentDate = Carbon::parse($appointment->appointment_date)->format('Y-m-d');
                $appointmentTime = is_string($appointment->appointment_time) 
                    ? $appointment->appointment_time 
                    : Carbon::parse($appointment->appointment_time)->format('H:i:s');
                
                $event->startDateTime = Carbon::parse($appointmentDate . ' ' . $appointmentTime);
                $event->endDateTime = Carbon::parse($appointmentDate . ' ' . $appointmentTime)->addHour();
                
                return $event->save();
            }
        } catch (\Exception $e) {
            \Log::error('Google Calendar error: ' . $e->getMessage());
            return null;
        }
    }

    public function deleteEvent($eventId)
    {
        if (!$this->isEnabled()) {
            return null;
        }

        try {
            $this->configureCalendar();
            
            $event = Event::find($eventId);
            if ($event) {
                $result = $event->delete();
                \Log::info('Google Calendar event deleted: ' . $eventId);
                return $result;
            } else {
                \Log::warning('Google Calendar event not found for deletion: ' . $eventId);
                return false;
            }
        } catch (\Exception $e) {
            \Log::error('Google Calendar delete error: ' . $e->getMessage());
            return null;
        }
    }

    private function configureCalendar()
    {
        $userId = auth()->id();
        if (!$userId) {
            return false;
        }
        $calendarId = Setting::where('key', 'googleCalendarId')
            ->where('user_id', $userId)
            ->value('value');
        $jsonPath = Setting::where('key', 'googleCalendarJsonPath')
            ->where('user_id', $userId)
            ->value('value');
        if ($calendarId && $jsonPath) {
            config([
                'google-calendar.calendar_id' => $calendarId,
                'google-calendar.auth_profiles.service_account.credentials_json' => storage_path('app/public/' . $jsonPath)
            ]);
        }
    }

    private function isEnabled()
    {
        $userId = auth()->id();
        if (!$userId) {
            return false;
        }
        $enabled = Setting::where('key', 'googleCalendarEnabled')
            ->where('user_id', $userId)
            ->value('value');
        $calendarId = Setting::where('key', 'googleCalendarId')
            ->where('user_id', $userId)
            ->value('value');
        $jsonPath = Setting::where('key', 'googleCalendarJsonPath')
            ->where('user_id', $userId)
            ->value('value');
        
        return $enabled === '1' && !empty($calendarId) && !empty($jsonPath);
    }
}