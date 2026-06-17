<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     */
    public function rootView(Request $request): string
    {
        return 'app'; // Use single unified template
    }

    /**
     * Determines if we are running in SSR mode.
     * Only enable SSR for public pages that need SEO.
     */
    public function ssr(Request $request): bool
    {
        // Disable SSR for admin/dashboard pages
        if ($request->routeIs(['dashboard', 'profile.*', 'admin.*']) || str_starts_with($request->path(), 'admin/')) {
            return false;
        }

        // Enable SSR for public pages (landing, auth, etc.)
        return true;
    }

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'roles' => $request->user() ? $request->user()->getRoleNames() : [],
                'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name') : [],
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
