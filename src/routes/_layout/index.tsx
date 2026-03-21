import { Button } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Button>하이루??</Button>
    </div>
  );
}
