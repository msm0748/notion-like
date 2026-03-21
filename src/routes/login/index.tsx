import { createFileRoute, redirect } from '@tanstack/react-router';
import { AuthForm } from '@/features/auth';

export const Route = createFileRoute('/login/')({
  component: LoginPage,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
      });
    }
  },
});

function LoginPage() {
  return <AuthForm />;
}
