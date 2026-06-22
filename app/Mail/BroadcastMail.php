<?php

namespace App\Mail;

use App\Models\BroadcastEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BroadcastMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public BroadcastEmail $broadcast)
    {
    }

    public function build()
    {
        return $this->subject($this->broadcast->subject)
                    ->view('emails.broadcast');
    }
}
