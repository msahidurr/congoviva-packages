<?php

namespace App\Services;

use App\Mail\BroadcastMail;
use App\Models\BroadcastEmail;
use App\Models\BroadcastEmailLog;
use App\Models\User;
use App\Models\Contact;
use App\Models\Newsletter;
use App\Models\Business;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class BroadcastEmailService
{
    public function getRecipients($userId, $userType, $recipientType, $recipientIds = null)
    {
        $recipients = [];

        if ($userType === 'superadmin') {
            switch ($recipientType) {
                case 'companies':
                    $query = User::where('type', 'company');
                    if ($recipientIds) {
                        $query->whereIn('id', $recipientIds);
                    }
                    $recipients = $query->get(['id', 'email', 'name'])->map(fn($u) => [
                        'id'    => $u->id,
                        'email' => $u->email,
                        'name'  => $u->name,
                    ])->toArray();
                    break;

                case 'contacts':
                    $query = Contact::whereNotNull('email')->where('is_landing_page', 1);
                    if ($recipientIds) {
                        $query->whereIn('id', $recipientIds);
                    }
                    $recipients = $query->get(['id', 'email', 'name'])->map(fn($c) => [
                        'id'    => $c->id,
                        'email' => $c->email,
                        'name'  => $c->name,
                    ])->toArray();
                    break;

                case 'newsletter':
                    $query = Newsletter::where('status', 'active');
                    if ($recipientIds) {
                        $query->whereIn('id', $recipientIds);
                    }
                    $recipients = $query->get(['id', 'email'])->map(fn($n) => [
                        'id'    => $n->id,
                        'email' => $n->email,
                        'name'  => null,
                    ])->toArray();
                    break;
            }
        } elseif ($userType === 'company') {
            switch ($recipientType) {
                case 'users':
                    $query = User::where('created_by', $userId);
                    if ($recipientIds) {
                        $query->whereIn('id', $recipientIds);
                    }
                    $recipients = $query->get(['id', 'email', 'name'])->map(fn($u) => [
                        'id'    => $u->id,
                        'email' => $u->email,
                        'name'  => $u->name,
                    ])->toArray();
                    break;

                case 'contacts':
                    $businessIds = Business::where('created_by', $userId)->pluck('id');
                    $query       = Contact::whereIn('business_id', $businessIds)->whereNotNull('email');
                    if ($recipientIds) {
                        $query->whereIn('id', $recipientIds);
                    }
                    $recipients = $query->get(['id', 'email', 'name'])->map(fn($c) => [
                        'id'    => $c->id,
                        'email' => $c->email,
                        'name'  => $c->name,
                    ])->toArray();
                    break;
            }
        }

        return $recipients;
    }

    public function processAllEmails($broadcastEmailId, $batchSize = 20, $delayBetweenBatches = 2)
    {
        $broadcast = BroadcastEmail::findOrFail($broadcastEmailId);

        $sentCount   = 0;
        $failedCount = 0;
        $batchNumber = 0;

        setEmailConfigurations($broadcast->user_id);

        // prevent PHP execution timeout for large recipient lists
        set_time_limit(0);

        // reset failed count before retry so count doesn't double
        $broadcast->update(['failed_count' => 0]);

        try {
            $broadcast->logs()->whereIn('status', ['pending', 'failed'])->chunkById($batchSize, function ($logs) use ($broadcast, &$sentCount, &$failedCount, &$batchNumber, $delayBetweenBatches) {
                $batchNumber++;

                foreach ($logs as $log) {
                    try {
                        Mail::to($log->recipient_email)->send(new BroadcastMail($broadcast));
                        $log->markAsSent();
                        $broadcast->incrementSent();
                        $sentCount++;
                    } catch (\Throwable $e) {
                        Log::error("Broadcast #{$broadcast->id} failed for {$log->recipient_email}: {$e->getMessage()}");
                        $log->update(['status' => 'failed', 'error_message' => $e->getMessage()]);
                        $broadcast->incrementFailed();
                        $failedCount++;
                    }
                }

                // delay between batches to avoid SMTP rate limit & domain block
                if ($broadcast->logs()->pending()->exists()) {
                    sleep($delayBetweenBatches);
                }
            });

            $hasFailed = $broadcast->logs()->failed()->exists();
            $hasPending = $broadcast->logs()->pending()->exists();

            if (!$hasPending && !$hasFailed) {
                $broadcast->markAsCompleted();
            }
            // if failed logs exist, keep status as 'processing' so cron retries them
        } catch (\Throwable $e) {
            Log::error("Broadcast #{$broadcast->id} processing error: {$e->getMessage()}");
            $broadcast->markAsFailed();
        }

        return [
            'sent_count'   => $sentCount,
            'failed_count' => $failedCount,
        ];
    }
}