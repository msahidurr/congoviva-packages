<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicFormController extends Controller
{
    /**
     * Store a new contact from public vCard.
     */
    public function storeContact(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|phone:AUTO|regex:/^\+\d{4,20}$/',
            'message' => 'nullable|string',
        ],
[
            'phone.phone' => __('Please enter a valid phone number with country code  (e.g. +1 5551234567).'),
            'phone.regex' => __('Phone number must start with "+" followed by country code (e.g. +1 5551234567).'),
        ]);

        // Set default status
        $validated['status'] = 'new';

        Contact::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => __('Thank you for your message. We will get back to you soon!')
            ]);
        }

        return back()->with('success', __('Thank you for your message. We will get back to you soon!'));
    }

    /**
     * Store a new appointment from public vCard.
     */
    public function storeAppointment(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|phone:AUTO|regex:/^\+\d{4,20}$/',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required|date_format:H:i',
            'message' => 'nullable|string',
        ],
[
            'phone.phone' => __('Please enter a valid phone number with country code  (e.g. +1 5551234567).'),
            'phone.regex' => __('Phone number must start with "+" followed by country code (e.g. +1 5551234567).'),
        ]);

        // Set default status
        $validated['status'] = 'scheduled';

        $appointment = Appointment::create($validated);

        // Trigger email notification
        event(new \App\Events\AppointmentCreated($appointment));

        // Check for email errors
        if (session()->has('email_error')) {
            $errorMessage = session('email_error');
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => __('Your appointment has been scheduled, but email notification failed.'),
                    'warning' => $errorMessage
                ]);
            }
            return back()->with('warning', __('Your appointment has been scheduled, but email notification failed: ') . $errorMessage);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => __('Your appointment has been scheduled. We will confirm shortly!')
            ]);
        }

        return back()->with('success', __('Your appointment has been scheduled. We will confirm shortly!'));
    }
}