import { AppShell, Box } from '@mantine/core';
import { Sidebar } from './sidebar';
import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <AppShell
      navbar={{
        width: 250,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      <AppShell.Navbar
        bg="var(--mantine-color-notionGray-1)"
        sx={{
          borderRight: '1px solid var(--mantine-color-notionGray-3)',
          zIndex: 10,
        }}
      >
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main h="100vh">
        <Box
          sx={{
            backgroundColor: 'var(--mantine-color-body)',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
