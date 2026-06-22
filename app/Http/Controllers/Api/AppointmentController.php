<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $businessIds = $request->user()->businesses()->pluck('id');
        
        $query = Appointment::with('business:id,name');
         // Filter by business
        if ($request->business_id) {
            $query->where('business_id', $request->business_id);
        } else {
            $query->whereIn('business_id', $businessIds);
        }
        // Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%')
                  ->orWhereHas('business', function($businessQuery) use ($request) {
                      $businessQuery->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }
                       
        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }
        
        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        // Per page
        $perPage = min($request->get('per_page', 15), 100);
        $appointments = $query->paginate($perPage);

        return apiSuccess(__('Appointments retrieved successfully'), [
            'appointments' => $appointments->items(),
            'pagination' => [
                'current_page' => $appointments->currentPage(),
                'last_page' => $appointments->lastPage(),
                'per_page' => $appointments->perPage(),
                'total' => $appointments->total(),
            ]
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $businessIds = $request->user()->businesses()->pluck('id');
        
        $appointment = Appointment::where('id', $id)
            ->whereIn('business_id', $businessIds)
            ->first();

        if (!$appointment) {
            return apiError(__('Appointment not found'), null, 404);
        }

        $appointment->delete();

        return apiSuccess(__('Appointment deleted successfully'));
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed'
        ]);

        $businessIds = $request->user()->businesses()->pluck('id');
        
        $appointment = Appointment::where('id', $id)
            ->whereIn('business_id', $businessIds)
            ->first();

        if (!$appointment) {
            return apiError(__('Appointment not found'), null, 404);
        }

        $appointment->update(['status' => $request->status]);

        return apiSuccess(__('Appointment status updated successfully'), [
            'appointment' => [
                'id' => $appointment->id,
                'status' => $appointment->status,
            ]
        ]);
    }
}