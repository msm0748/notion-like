import '@mantine/core/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import MantineProvider from './app/mantine-provider';
import { useAuth } from '@/entities/auth';
import { AuthProvider } from './app/auth-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retryOnMount: true,
      retry: 0,
    },
  },
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
