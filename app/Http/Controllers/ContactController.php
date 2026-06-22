<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Business;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $authUser = auth()->user();
        
        // Get accessible businesses based on user type and permissions
        if ($authUser->type === 'company') {
            $staffIds = User::where('created_by', $authUser->id)->pluck('id')->toArray();
            $staffIds = array_merge([$authUser->id], $staffIds);
            $accessibleBusinesses = Business::whereIn('created_by', $staffIds)->pluck('id');
        } else {
            // Staff users can only access businesses created by their company
            if ($authUser->can('manage-contacts') || $authUser->can('view-contacts')) {
                $accessibleBusinesses = Business::where('created_by', $authUser->id)->pluck('id');
            } else {
                $accessibleBusinesses = collect([]);
            }
        }
        
        // If no accessible businesses, return empty result
        if ($accessibleBusinesses->isEmpty()) {
            $contacts = Contact::whereRaw('1 = 0')->paginate($request->get('per_page', 10));
            $businesses = collect([]);
        } else {
            $query = Contact::with('business')
                ->whereIn('business_id', $accessibleBusinesses)
                ->orderBy($request->get('sort_field', 'created_at'), $request->get('sort_direction', 'desc'));

            // Search functionality
            if ($request->filled('search')) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhereHas('business', function ($businessQuery) use ($search) {
                          $businessQuery->where('name', 'like', "%{$search}%");
                      });
                });
            }

            // Business filter
            if ($request->filled('business')) {
                $businessId = $request->get('business');
                // Ensure the requested business is accessible to the user
                if ($accessibleBusinesses->contains($businessId)) {
                    $query->where('business_id', $businessId);
                } else {
                    // If user tries to access unauthorized business, return empty result
                    $query->whereRaw('1 = 0');
                }
            }

            // Status filter
            if ($request->filled('status')) {
                $query->where('status', $request->get('status'));
            }

            $contacts = $query->paginate($request->get('per_page', 10));
            $businesses = Business::whereIn('id', $accessibleBusinesses)->orderBy('name')->get(['id', 'name']);
        }

        return Inertia::render('contacts/index', [
            'contacts' => $contacts,
            'businesses' => $businesses,
            'filters' => $request->only(['search', 'business', 'status', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|phone:AUTO|regex:/^\+\d{4,20}$/',
            'message' => 'nullable|string',
            'status' => 'required|in:new,contacted,qualified,converted,closed',
            'notes' => 'nullable|string',
        ],
[
            'phone.phone' => __('Please enter a valid phone number with country code  (e.g. +1 5551234567).'),
            'phone.regex' => __('Phone number must start with "+" followed by country code (e.g. +1 5551234567).'),
        ]);
        
        // Verify user has access to the business
        $authUser = auth()->user();
        $business = Business::find($validated['business_id']);
        
        if (!$business) {
            return redirect()->back()->with('error', __('Business not found.'));
        }

        Contact::create($validated);

        return redirect()->back()->with('success', __('Contact created successfully.'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        // Verify user has access to the contact's business
        $authUser = auth()->user();
        $business = $contact->business;
        
        if (!$business) {
            return redirect()->back()->with('error', __('Business not found.'));
        }
        
        $hasAccess = false;
        if ($authUser->type === 'company') {
            $hasAccess = $business->created_by === $authUser->id;
        } else {
            // Staff users can only update contacts for businesses created by their company
            if ($authUser->can('manage-contacts') || $authUser->can('edit-contacts')) {
                $hasAccess = $business->created_by === $authUser->created_by;
            }
        }
        
        if (!$hasAccess) {
            return redirect()->back()->with('error', __('You do not have permission to update this contact.'));
        }
        
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|phone:AUTO|regex:/^\+\d{4,20}$/',
            'message' => 'nullable|string',
            'status' => 'required|in:new,contacted,qualified,converted,closed',
            'notes' => 'nullable|string',
        ],
[
            'phone.phone' => __('Please enter a valid phone number with country code  (e.g. +1 5551234567).'),
            'phone.regex' => __('Phone number must start with "+" followed by country code (e.g. +1 5551234567).'),
        ]);
        
        // Also verify the new business_id if it's being changed
        if ($validated['business_id'] != $contact->business_id) {
            $newBusiness = Business::find($validated['business_id']);
            if (!$newBusiness) {
                return redirect()->back()->with('error', __('New business not found.'));
            }
            
            $hasAccessToNewBusiness = false;
            if ($authUser->type === 'company') {
                $hasAccessToNewBusiness = $newBusiness->created_by === $authUser->id;
            } else {
                if ($authUser->can('manage-contacts') || $authUser->can('edit-contacts')) {
                    $hasAccessToNewBusiness = $newBusiness->created_by === $authUser->created_by;
                }
            }
            
            if (!$hasAccessToNewBusiness) {
                return redirect()->back()->with('error', __('You do not have permission to move this contact to the selected business.'));
            }
        }

        $contact->update($validated);

        return redirect()->back()->with('success', __('Contact updated successfully.'));
    }

    /**
     * Send reply to contact.
     */
    public function reply(Request $request, Contact $contact)
    {
        // Verify user has access to the contact's business
        $business = $contact->business;
        
        if (!$business) {
            return redirect()->back()->with('error', __('Business not found.'));
        }
        
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'status' => 'required|in:new,contacted,qualified,converted,closed',
        ]);

        // Always update status
        $contact->update(['status' => $validated['status']]);
        if (!empty($contact->email)) {
            try {
                setEmailConfigurations();
                $fromEmail = getSetting('email_from_address') ?: config('mail.from.address');
                $fromName  = getSetting('email_from_name') ?: config('mail.from.name');
                Mail::send([], [], function ($message) use ($contact, $validated, $fromEmail, $fromName) {
                    $message->to($contact->email, $contact->name)
                        ->subject($validated['subject'])
                        ->html(nl2br(e($validated['message'])))
                        ->from($fromEmail, $fromName);
                });

                return redirect()->back()->with('success', __('Reply sent successfully.'));
            } catch (\Exception $e) {
                Log::error('Failed to send reply: ' . $e->getMessage());
                return back()->with('error', __('Failed to send reply. Please check email settings.'));
            }
        }
        return redirect()->back()->with('success', __('Status updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        // Verify user has access to the contact's business
        $business = $contact->business;
        
        if (!$business) {
            return redirect()->back()->with('error', __('Business not found.'));
        }
        
        $contact->delete();

        return redirect()->back()->with('success', __('Contact deleted successfully.'));
    }
}