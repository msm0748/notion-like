import { Fragment } from 'react';
import { Group, Text, rem, ActionIcon, Menu } from '@mantine/core';
import { Lock, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { usePageBreadcrumb } from './use-page-breadcrumb';

interface TopNavProps {
  pageId: string;
}

export function TopNav({ pageId }: TopNavProps) {
  const navigate = useNavigate();
  const breadcrumb = usePageBreadcrumb(pageId);

  return (
    <Group
      h={45}
      px="lg"
      justify="space-between"
      sx={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--mantine-color-body)',
        /* BlockNote 테이블 핸들(z≈10)이 상단으로 비칠 때 내비 아래에 가려지도록 */
        zIndex: 25,
      }}
    >
      <Group gap="xs">
        {breadcrumb.map((page, i) => (
          <Fragment key={page.id}>
            {i > 0 && (
              <ChevronRight
                style={{ width: rem(14), height: rem(14) }}
                color="var(--mantine-color-dimmed)"
              />
            )}
            <Text
              size="sm"
              fw={page.id === pageId ? 500 : undefined}
              c={page.id === pageId ? undefined : 'dimmed'}
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                navigate({ to: '/page/$pageId', params: { pageId: page.id } })
              }
            >
              {page.title || '제목없음'}
            </Text>
          </Fragment>
        ))}
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
  );
}
