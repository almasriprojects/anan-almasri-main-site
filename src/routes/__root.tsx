import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { BookCallProvider } from '../components/BookCallModal/context'

interface RouterContext {
  // Placeholder for future context (auth, etc.)
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <BookCallProvider>
      <Outlet />
    </BookCallProvider>
  )
}
