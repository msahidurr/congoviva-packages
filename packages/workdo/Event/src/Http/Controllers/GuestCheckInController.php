<?php

namespace Workdo\Event\Http\Controllers;

use Workdo\Event\Models\Event;
use Workdo\Event\Models\GuestArrival;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class GuestCheckInController extends Controller
{
    /**
     * Show the check-in page for venue staff (public, slug-based)
     */
    public function showCheckInPage($slug)
    {
        $event = Event::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $guestsList = $event->config_sections['guests']['guests_list'] ?? [];
        $arrivals = GuestArrival::where('event_id', $event->id)->get();
        
        // Create lookup map for quick arrival checks
        $arrivedGuests = $arrivals->mapWithKeys(function ($arrival) {
            $key = "{$arrival->first_name}|{$arrival->last_name}|{$arrival->table_number}";
            return [$key => $arrival];
        });

        return Inertia::render('Event/public/GuestCheckIn', [
            'event' => $event,
            'guestsList' => $guestsList,
            'arrivedGuests' => $arrivedGuests
        ]);
    }

    /**
     * API endpoint to check in a guest
     */
    public function checkIn(Request $request, $slug)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'table_number' => 'required|string'
        ]);

        $event = Event::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Find or create guest arrival record
        $arrival = GuestArrival::updateOrCreate(
            [
                'event_id' => $event->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'table_number' => $validated['table_number']
            ],
            [
                'arrived_at' => now(),
                'checked_in_by' => Auth::id()
            ]
        );

        return response()->json([
            'success' => true,
            'message' => __('Guest checked in successfully'),
            'arrival' => $arrival
        ]);
    }

    /**
     * API endpoint to undo check-in (mark as not arrived)
     */
    public function undoCheckIn(Request $request, $slug)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'table_number' => 'required|string'
        ]);

        $event = Event::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        GuestArrival::where('event_id', $event->id)
            ->where('first_name', $validated['first_name'])
            ->where('last_name', $validated['last_name'])
            ->where('table_number', $validated['table_number'])
            ->update(['arrived_at' => null]);

        return response()->json([
            'success' => true,
            'message' => __('Check-in undone successfully')
        ]);
    }

    /**
     * Admin API: Get all guests with arrival status for an event
     */
    public function getGuestArrivals($id)
    {
        $event = Event::findOrFail($id);
        
        if ($event->user_id != Auth::id()) {
            abort(403);
        }

        $guestsList = $event->config_sections['guests']['guests_list'] ?? [];
        $arrivals = GuestArrival::where('event_id', $event->id)->get();

        // Enrich guest list with arrival status
        $enrichedGuests = collect($guestsList)->map(function ($guest) use ($arrivals) {
            $arrival = $arrivals->first(function ($a) use ($guest) {
                return $a->first_name === $guest['first_name'] &&
                       $a->last_name === $guest['last_name'] &&
                       $a->table_number === $guest['table'];
            });

            return [
                'first_name' => $guest['first_name'],
                'last_name' => $guest['last_name'],
                'table' => $guest['table'],
                'seat' => $guest['seat'] ?? null,
                'arrived_at' => $arrival?->arrived_at,
                'is_arrived' => $arrival && $arrival->arrived_at !== null
            ];
        });

        $stats = [
            'total' => count($guestsList),
            'arrived' => $enrichedGuests->where('is_arrived', true)->count(),
            'pending' => $enrichedGuests->where('is_arrived', false)->count()
        ];

        return response()->json([
            'guests' => $enrichedGuests,
            'stats' => $stats
        ]);
    }

    /**
     * Admin API: Manually mark guest as arrived
     */
    public function markArrivedAdmin(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        
        if ($event->user_id != Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'table_number' => 'required|string'
        ]);

        $arrival = GuestArrival::updateOrCreate(
            [
                'event_id' => $event->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'table_number' => $validated['table_number']
            ],
            [
                'arrived_at' => now(),
                'checked_in_by' => Auth::id()
            ]
        );

        return response()->json([
            'success' => true,
            'message' => __('Guest marked as arrived'),
            'arrival' => $arrival
        ]);
    }

    /**
     * Admin API: Mark guest as not arrived
     */
    public function markNotArrivedAdmin(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        
        if ($event->user_id != Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'table_number' => 'required|string'
        ]);

        GuestArrival::where('event_id', $event->id)
            ->where('first_name', $validated['first_name'])
            ->where('last_name', $validated['last_name'])
            ->where('table_number', $validated['table_number'])
            ->update(['arrived_at' => null]);

        return response()->json([
            'success' => true,
            'message' => __('Guest marked as not arrived')
        ]);
    }
}
