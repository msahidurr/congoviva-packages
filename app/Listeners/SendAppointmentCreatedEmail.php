<?php

namespace App\Listeners;

use App\Events\AppointmentCreated;
use App\Services\EmailTemplateService;
use App\Services\WebhookService;
use Exception;

class SendAppointmentCreatedEmail
{
    private static array $processedAppointments = [];
    
    public function __construct(
        private EmailTemplateService $emailService,
        private WebhookService $webhookService
    ) {
    }

    public function handle(AppointmentCreated $event): void
    {
        $appointment = $event->appointment;
        $business = $appointment->business;
        
        // Prevent duplicate processing
        $appointmentKey = $appointment->id . '_' . $appointment->updated_at->timestamp;
        if (in_array($appointmentKey, self::$processedAppointments)) {
            return;
        }
        
        self::$processedAppointments[] = $appointmentKey;

        if (!$business) {
            \Log::warning('Appointment created without business association', ['appointment_id' => $appointment->id]);
            return;
        }

        // Prepare email variables
        $variables = [
            '{app_name}' => config('app.name'),
            '{appointment_name}' => $appointment->name,
            '{appointment_email}' => $appointment->email ?? 'N/A',
            '{appointment_phone}' => $appointment->phone ?? 'N/A',
            '{appointment_date}' => $appointment->appointment_date->format('Y-m-d'),
            '{appointment_time}' => $appointment->appointment_time ? $appointment->appointment_time->format('H:i') : 'N/A',
            '{business_name}' => $business->name,
            '{appointment_status}' => ucfirst($appointment->status),
            '{appointment_message}' => $appointment->message ?? 'N/A',
            '{created_date}' => $appointment->created_at->format('Y-m-d H:i:s'),
        ];

        try {
            // Send email to business owner (company user)
            $businessOwner = $business->user; // Get business owner
            if ($businessOwner && $businessOwner->email) {
                $this->emailService->sendTemplateEmailWithLanguage(
                    templateName: 'Appointment Created',
                    variables: $variables,
                    toEmail: $businessOwner->email,
                    toName: $businessOwner->name ?? $business->name,
                    language: $businessOwner->lang ?? 'en'
                );
            }

            // Send confirmation email to customer if they provided email
            if ($appointment->email && $appointment->email !== $businessOwner?->email) {
                // Modify variables for customer confirmation
                $customerVariables = array_merge($variables, [
                    '{recipient_name}' => $appointment->name,
                ]);

                // Use business owner's language for customer email too (business context)
                $this->emailService->sendTemplateEmailWithLanguage(
                    templateName: 'Appointment Created',
                    variables: $customerVariables,
                    toEmail: $appointment->email,
                    toName: $appointment->name,
                    language: $businessOwner->lang ?? 'en'
                );
            }
            
            // Trigger webhooks for New Appointment
            $this->webhookService->triggerWebhooks('New Appointment', $appointment->toArray(), $businessOwner->id);

        } catch (Exception $e) {
            // Store error in session for frontend notification
            session()->flash('email_error', 'Failed to send email notification: ' . $e->getMessage());
        }
    }
}