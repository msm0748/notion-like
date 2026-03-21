import {
  Menu,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  rem,
  Box,
} from '@mantine/core';
import {
  LogOut,
  Settings,
  User as UserIcon,
  ChevronsUpDown,
} from 'lucide-react';
import { useState } from 'react';
import { logout } from '../api/auth';

interface UserProfileMenuProps {
  user: {
    email?: string | null;
    name?: string | null;
    avatar_url?: string | null;
  } | null;
}

export function UserProfileMenu({ user }: UserProfileMenuProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // invalidate router or redirect
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  // A generic display name
  const displayName = user.name || user.email?.split('@')[0] || 'User';

  return (
    <Menu
      width={260}
      position="bottom-start"
      transitionProps={{ transition: 'pop-top-left' }}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          w="100%"
          p="sm"
          sx={{
            borderRadius: 'var(--mantine-radius-md)',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'var(--mantine-color-gray-1)',
            },
            '[data-mantine-color-scheme="dark"] &:hover': {
              backgroundColor: 'var(--mantine-color-dark-6)',
            },
          }}
        >
          <Group gap="sm" wrap="nowrap" justify="space-between">
            <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
              <Avatar
                src={user.avatar_url}
                size={32}
                radius="md"
                bg="var(--mantine-color-gray-2)"
              />
              <Box style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <Text size="sm" fw={600} truncate>
                  {displayName}'s Notion
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  Free Plan
                </Text>
              </Box>
            </Group>
            <ChevronsUpDown
              style={{ width: rem(14), height: rem(14) }}
              color="var(--mantine-color-dimmed)"
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Box
          px="sm"
          py="sm"
          mb="xs"
          sx={{
            borderBottom: '1px solid var(--mantine-color-default-border)',
          }}
        >
          <Text size="xs" fw={500} truncate>
            {user.email}
          </Text>
        </Box>

        <Menu.Item
          leftSection={<Settings style={{ width: rem(14), height: rem(14) }} />}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          leftSection={<UserIcon style={{ width: rem(14), height: rem(14) }} />}
        >
          Profile
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<LogOut style={{ width: rem(14), height: rem(14) }} />}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
