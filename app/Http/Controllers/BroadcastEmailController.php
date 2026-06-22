<?php

namespace App\Http\Controllers;

use App\Models\BroadcastEmail;
use App\Services\BroadcastEmailService;
use App\Http\Requests\StoreBroadcastEmailRequest;
use App\Models\BroadcastEmailLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BroadcastEmailController extends Controller
{
    protected $broadcastService;

    public function __construct(BroadcastEmailService $broadcastService)
    {
        $this->broadcastService = $broadcastService;
    }

    public function index(Request $request)
    {
        if (!Auth::user()->can('manage-broadcast-emails')) {
            return back()->with('error', __('Permission denied'));
        }

        $user = auth()->user();

        if (!$user->isSuperAdmin() && !$user->plan?->hasBroadcastEmail()) {
            abort(403, 'Broadcast email feature not available in your plan.');
        }

        $query = BroadcastEmail::where('user_id', $user->id);

        if ($request->search) {
            $query->where('subject', 'like', '%' . $request->search . '%');
        }

        $perPage    = $request->per_page ?? 15;
        $broadcasts = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('BroadcastEmails/Index', [
            'broadcasts' => $broadcasts,
            'filters'    => $request->only(['search', 'per_page']),
        ]);
    }

    public function create()
    {
        if (!Auth::user()->can('create-broadcast-emails')) {
            return back()->with('error', __('Permission denied'));
        }

        $user     = auth()->user();
        $userType = $user->isSuperAdmin() ? 'superadmin' : 'company';
        $types    = $userType === 'superadmin' ? ['companies', 'contacts', 'newsletter'] : ['users', 'contacts'];

        $typeLabels = [
            'companies'  => 'Company',
            'contacts'   => 'Contact',
            'newsletter' => 'Newsletter',
            'users'      => 'User',
        ];

        $recipients = [];
        foreach ($types as $type) {
            $list = $this->broadcastService->getRecipients($user->id, $userType, $type);
            foreach ($list as $r) {
                $recipients[] = [
                    'value' => $type . ':' . $r['id'],
                    'label' => $r['email'] . ' (' . ($typeLabels[$type] ?? ucfirst($type)) . ')',
                ];
            }
        }

        return inertia('BroadcastEmails/Create', ['recipients' => $recipients]);
    }

    public function store(StoreBroadcastEmailRequest $request)
    {
        if (!Auth::user()->can('create-broadcast-emails')) {
            return back()->with('error', __('Permission denied'));
        }

        $user     = auth()->user();
        $userType = $user->isSuperAdmin() ? 'superadmin' : 'company';

        $selectedRecipients = collect($request->recipients)->map(function ($item) use ($user, $userType) {
            [$type, $id] = explode(':', $item['value'] ?? ($item['type'] . ':' . $item['id']));
            $list        = $this->broadcastService->getRecipients($user->id, $userType, $type, [$id]);
            return !empty($list) ? array_merge($list[0], ['type' => $type]) : null;
        })->filter()->values()->toArray();

        $broadcast = BroadcastEmail::create([
            'user_id'          => $user->id,
            'user_type'        => $userType,
            'subject'          => $request->subject,
            'message'          => $request->message,
            'total_recipients' => count($selectedRecipients),
            'status'           => 'scheduled',
            'scheduled_at'     => now(),
            'created_by'       => $user->id,
        ]);

        foreach ($selectedRecipients as $recipient) {
            BroadcastEmailLog::create([
                'broadcast_email_id' => $broadcast->id,
                'recipient_email'    => $recipient['email'],
                'status'             => 'pending',
            ]);
        }

        return redirect()->route('broadcast-emails.index')
            ->with('success', __('Broadcast email created successfully.'));
    }

    public function show($id)
    {
        if (!Auth::user()->can('view-broadcast-emails')) {
            return back()->with('error', __('Permission denied'));
        }

        $user      = auth()->user();
        $broadcast = BroadcastEmail::where('user_id', $user->id)->findOrFail($id);
        $logs      = $broadcast->logs()->latest()->paginate(50);

        $statistics = [
            'total'   => $broadcast->total_recipients,
            'sent'    => $broadcast->sent_count,
            'failed'  => $broadcast->failed_count,
            'pending' => $broadcast->getPendingCount(),
        ];

        return Inertia::render('BroadcastEmails/Show', [
            'broadcast'  => $broadcast,
            'logs'       => $logs,
            'statistics' => $statistics,
        ]);
    }

    public function destroy($id)
    {
        if (!Auth::user()->can('delete-broadcast-emails')) {
            return back()->with('error', __('Permission denied'));
        }

        $user      = auth()->user();
        $broadcast = BroadcastEmail::where('user_id', $user->id)->findOrFail($id);
        $broadcast->delete();

        return redirect()->route('broadcast-emails.index')
            ->with('success', __('Broadcast email deleted successfully.'));
    }
}
