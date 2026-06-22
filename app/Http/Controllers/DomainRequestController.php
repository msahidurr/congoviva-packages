<?php

namespace App\Http\Controllers;

use App\Models\DomainRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DomainRequestController extends BaseController
{
    public function index(Request $request)
    {
        $query = DomainRequest::with(['user', 'business', 'biolink', 'approver', 'rejector']);

        // Apply search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('domain', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('users.name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('business', function ($businessQuery) use ($search) {
                      $businessQuery->where('businesses.name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('biolink', function ($bioLinkQuery) use ($search) {
                      $bioLinkQuery->where('bio_links.name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);
        $domainRequests = $query->latest()->paginate($perPage);

        return Inertia::render('domain-requests/index', [
            'domainRequests' => $domainRequests,
            'filters' => $request->only(['search', 'status', 'per_page'])
        ]);
    }

    public function approve(DomainRequest $domainRequest)
    {
        $domainRequest->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => Auth::id(),
        ]);

        return redirect()->route('domain-requests.index')->with('success', __('Domain request approved successfully!'));
    }

    public function reject(DomainRequest $domainRequest)
    {
        $domainRequest->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejected_by' => Auth::id(),
        ]);

        return redirect()->route('domain-requests.index')->with('success', __('Domain request rejected successfully!'));
    }

    public function destroy(DomainRequest $domainRequest)
    {
        $domainRequest->delete();

        return redirect()->route('domain-requests.index')->with('success', __('Domain request deleted successfully!'));
    }
}
