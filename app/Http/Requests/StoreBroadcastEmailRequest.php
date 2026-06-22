<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBroadcastEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = auth()->user();

        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->plan?->hasBroadcastEmail() ?? false;
    }

    public function rules(): array
    {
        return [
            'subject'           => 'required|string|max:255',
            'message'           => 'required|string',
            'recipients'        => 'required|array|min:1',
            'recipients.*.type' => 'required|string|in:companies,contacts,newsletter,users',
            'recipients.*.id'   => 'required|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'subject.required'    => __('Subject is required.'),
            'message.required'    => __('Message is required.'),
            'recipients.required' => __('Please select at least one recipient.'),
            'recipients.min'      => __('Please select at least one recipient.'),
        ];
    }
}
