<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BroadcastEmail;
use App\Services\BroadcastEmailService;

class ProcessBroadcastEmails extends Command
{
    protected $signature = 'broadcast:process';
    protected $description = 'Process scheduled broadcast emails';

    protected $broadcastService;

    public function __construct(BroadcastEmailService $broadcastService)
    {
        parent::__construct();
        $this->broadcastService = $broadcastService;
    }

    public function handle()
    {
        $this->info('Starting broadcast email processing...');

        $broadcasts = BroadcastEmail::whereIn('status', ['scheduled', 'processing'])
            ->where('scheduled_at', '<=', now())
            ->get();

        if ($broadcasts->isEmpty()) {
            $this->info('No broadcasts to process.');
            return 0;
        }

        foreach ($broadcasts as $broadcast) {
            $this->info("Processing broadcast #{$broadcast->id}: {$broadcast->subject}");

            $broadcast->markAsProcessing();

            $result = $this->broadcastService->processAllEmails($broadcast->id);
            $this->info("Sent: {$result['sent_count']}, Failed: {$result['failed_count']}");
        }

        $this->info('Broadcast email processing completed.');
        return 0;
    }
}
