<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use App\Models\User;

class MailConfigService
{
    public static function setDynamicConfig()
    {
        $superAdmin = User::where('type', 'superadmin')->first();
        if ($superAdmin) {
            $settings = [
                'driver' => getSetting('email_driver', 'smtp', $superAdmin->id),
                'host' => getSetting('email_host', 'smtp.example.com', $superAdmin->id),
                'port' => getSetting('email_port', '587', $superAdmin->id),
                'username' => getSetting('email_username', '', $superAdmin->id),
                'password' => getSetting('email_password', '', $superAdmin->id),
                'encryption' => getSetting('email_encryption', 'tls', $superAdmin->id),
                'fromAddress' => getSetting('email_from_address', 'noreply@example.com', $superAdmin->id),
                'fromName' => getSetting('email_from_name', config('app.name', 'APP_NAME'), $superAdmin->id)
            ];
        } else {
            $settings = [
                'driver' => getSetting('email_driver', 'smtp'),
                'host' => getSetting('email_host', 'smtp.example.com'),
                'port' => getSetting('email_port', '587'),
                'username' => getSetting('email_username', ''),
                'password' => getSetting('email_password', ''),
                'encryption' => getSetting('email_encryption', 'tls'),
                'fromAddress' => getSetting('email_from_address', 'noreply@example.com'),
                'fromName' => getSetting('email_from_name', config('app.name', 'APP_NAME'))
            ];
        }

        Config::set([
            'mail.default' => $settings['driver'],
            'mail.mailers.smtp.host' => $settings['host'],
            'mail.mailers.smtp.port' => $settings['port'],
            'mail.mailers.smtp.encryption' => $settings['encryption'] === 'none' ? null : $settings['encryption'],
            'mail.mailers.smtp.username' => $settings['username'],
            'mail.mailers.smtp.password' => $settings['password'],
            'mail.from.address' => $settings['fromAddress'],
            'mail.from.name' => $settings['fromName'],
        ]);
    }
}