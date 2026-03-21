import * as React from 'react';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import type { AuthContext } from '@/shared/type/auth.type';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: AuthContext;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}
