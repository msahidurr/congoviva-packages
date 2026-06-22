<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FreePlanController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'coupon_code' => 'nullable|string'
        ]);

        try {
            $user = auth()->user();
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null, $validated['billing_cycle']);

            // Only handle free plans
            if (!$pricing['is_free']) {
                return response()->json([
                    'success' => false,
                    'message' => __('This plan requires payment processing')
                ], 400);
            }

            // Create plan order for free plan
            $planOrder = PlanOrder::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'coupon_id' => $pricing['coupon_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'free',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'original_price' => $pricing['original_price'],
                'discount_amount' => $pricing['discount_amount'],
                'final_price' => $pricing['final_price'],
                'payment_id' => 'FREE_' . strtoupper(Str::random(10)),
                'status' => 'approved',
                'ordered_at' => now(),
                'processed_at' => now(),
            ]);

            // Activate the subscription immediately
            $planOrder->activateSubscription();

            return response()->json([
                'success' => true,
                'message' => __('Free plan activated successfully'),
                'order_id' => $planOrder->order_number
            ]);

        } catch (\Exception $e) {
            \Log::error('Free plan subscription error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => __('Failed to activate free plan: :error', ['error' => $e->getMessage()])
            ], 500);
        }
    }
}