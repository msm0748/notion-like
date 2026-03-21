import { MainLayout } from '@/widgets/layouts';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    }
  },
});

function RouteComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
