<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ManualPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            
            createPlanOrder([
                'user_id' => auth()->id(),
                'plan_id' => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'manually',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => 'MANUAL_' . strtoupper(Str::random(10)),
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => __('Manual payment order created successfully.'),
                'status' => 'pending'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => __('Failed to create manual payment order: :error', ['error' => $e->getMessage()])
            ], 500);
        }
    }
}