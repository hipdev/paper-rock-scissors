import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect
} from '@convex-dev/auth/nextjs/server'

const isSignInPage = createRouteMatcher(['/', '/signup'])
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default convexAuthNextjsMiddleware(
  (request) => {
    if (isSignInPage(request) && isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, '/dashboard')
    }
    if (isProtectedRoute(request) && !isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, '/')
    }
  },
  {
    apiRoute: '/api/convex/auth'
  }
)

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
