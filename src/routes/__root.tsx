import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { BookCallProvider } from '../components/BookCallModal/context'

interface RouterContext {
  // Placeholder for future context (auth, etc.)
}

// This router instance is only ever mounted for the dashboard subtree (see
// src/App.tsx — `/`, `/demo`, `/legacy` are handled before this router is
// reached), so a single check here at the true root of the tree covers every
// dashboard page regardless of how individual route files are parented.
async function requireAdminSession() {
  try {
    const res = await fetch('/api/admin/session', { credentials: 'same-origin' });
    const data = await res.json().catch(() => null);
    if (data?.authenticated) return;
  } catch {
    // fall through to redirect below
  }
  // A hard navigation (not a router-internal redirect) — "/" isn't part of
  // this router's own tree, it's owned by App.tsx's outer switch.
  window.location.href = '/';
  throw new Error('Not authenticated');
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: requireAdminSession,
  component: RootLayout,
})

function RootLayout() {
  return (
    <BookCallProvider>
      <Outlet />
    </BookCallProvider>
  )
}
