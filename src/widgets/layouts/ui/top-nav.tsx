import { Group, Text, rem, ActionIcon, Menu } from '@mantine/core'
import { Lock, MoveRight, MoreHorizontal } from 'lucide-react'

export function TopNav() {
  return (
    <Group
      h={45}
      px="lg"
      justify="space-between"
      sx={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--mantine-color-body)',
        zIndex: 10,
      }}
    >
      <Group gap="xs">
        <Text size="sm" c="dimmed" sx={{ cursor: 'pointer' }}>
          Next
        </Text>
        <MoveRight
          style={{ width: rem(14), height: rem(14) }}
          color="var(--mantine-color-dimmed)"
        />
        <Text size="sm" fw={500} sx={{ cursor: 'pointer' }}>
          React로 변경시 nginx 설정들
        </Text>
      </Group>

      <Group gap="xs">
        <Group
          gap="4"
          c="dimmed"
          px="xs"
          py={4}
          sx={{
            borderRadius: 'var(--mantine-radius-sm)',
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'var(--mantine-color-gray-1)' },
          }}
        >
          <Lock style={{ width: rem(14), height: rem(14) }} />
          <Text size="xs">개인 페이지</Text>
        </Group>

        <Menu position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <MoreHorizontal style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>Page Settings</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}
