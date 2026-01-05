import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

import {
  NotFoundView,
  ForbiddenView,
  ServerErrorView,
  GenericErrorView,
} from './error-views';

/**
 * React Router error boundary component
 * Used as errorElement in route definitions to handle route-level errors
 * Also used as catch-all route element to show 404 for unknown paths
 */
export function RouteErrorBoundary() {
  const error = useRouteError();

  // No error means this is rendered as catch-all route element (not errorElement)
  // This happens when user visits non-existent path like /asdfasdf
  if (!error) {
    return <NotFoundView />;
  }

  // Handle HTTP error responses
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFoundView />;
      case 403:
        return <ForbiddenView />;
      case 500:
        return <ServerErrorView />;
      default:
        return <GenericErrorView message={`${error.status} ${error.statusText}`} />;
    }
  }

  // Handle JS errors
  const errorMessage = error instanceof Error ? error.message : 'Nepoznata greška';
  return <GenericErrorView message={errorMessage} />;
}
