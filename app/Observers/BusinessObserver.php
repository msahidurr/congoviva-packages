<?php

namespace App\Observers;

use App\Models\Business;
use App\Models\User;

class BusinessObserver
{
    /**
     * Handle the Business "created" event.
     */
    public function created(Business $business): void
    {
        // If this is the user's first business, set it as current business
        $user = User::find($business->created_by);
        if ($user && is_null($user->current_business)) {
            $user->current_business = $business->id;
            $user->save();
        }
    }

    /**
     * Handle the Business "deleted" event.
     */
    public function deleted(Business $business): void
    {
        // If this was the user's current business, set current_business to null
        $user = User::where('current_business', $business->id)->first();
        if ($user) {
            // Find another business to set as current, or set to null
            $anotherBusiness = Business::where('created_by', $user->id)
                ->where('id', '!=', $business->id)
                ->first();
                
            $user->current_business = $anotherBusiness ? $anotherBusiness->id : null;
            $user->save();
        }
    }
}