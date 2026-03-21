import { Box, Group, Text, ActionIcon, Menu, rem } from '@mantine/core';
import { Trash2, MoreVertical, FileText, Star } from 'lucide-react';
import { Link } from '@/shared/ui/link';
import { DEFAULT_TITLE } from '@/shared/conf/constant';
import type { PageDto } from '@/entities/pages';

interface PageRowProps {
  page: PageDto;
  currentPageId: string | undefined;
  isFavorite: boolean;
  depth?: number;
  onToggleFavorite: (args: { pageId: string; isFavorite: boolean }) => void;
  onDelete: (id: string) => void;
}

export function PageRow({
  page,
  currentPageId,
  isFavorite,
  depth = 0,
  onToggleFavorite,
  onDelete,
}: PageRowProps) {
  const isActive = currentPageId === page.id;

  return (
    <Box
      className="sidebar-page-row"
      sx={{
        width: '100%',
        minWidth: 0,
        borderRadius: 'var(--mantine-radius-sm)',
        position: 'relative',
        backgroundColor: isActive
          ? 'var(--mantine-color-notionGray-3)'
          : 'none',
        '&:hover .page-actions': {
          opacity: 1,
        },
        '&:hover': {
          backgroundColor: 'var(--mantine-color-notionGray-2)',
        },
      }}
    >
      <Group
        wrap="nowrap"
        gap={0}
        sx={{ width: '100%', minWidth: 0, paddingLeft: depth * 16 }}
        align="center"
      >
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Link
            to="/page/$pageId"
            params={{ pageId: page.id }}
            variant="subtle"
            label={
              <Group wrap="nowrap" gap={6} style={{ minWidth: 0 }}>
                <FileText
                  style={{
                    width: rem(14),
                    height: rem(14),
                    flexShrink: 0,
                    color: 'var(--mantine-color-notionGray-6)',
                  }}
                />
                <Text size="sm" truncate fw={isActive ? 500 : 400}>
                  {page.title?.trim() || DEFAULT_TITLE}
                </Text>
              </Group>
            }
            sx={{
              '&[data-status=active]': {
                backgroundColor: 'transparent',
              },
            }}
          />
        </Box>

        <Menu position="bottom-start" closeOnClickOutside>
          <Menu.Target>
            <ActionIcon
              className="page-actions"
              variant="subtle"
              color="gray"
              size="sm"
              sx={{
                opacity: 0,
                transition: 'opacity 0.12s ease',
                flexShrink: 0,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-label="페이지 메뉴"
            >
              <MoreVertical
                style={{ width: rem(14), height: rem(14) }}
                color="var(--mantine-color-notionGray-6)"
              />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <Star
                  style={{ width: rem(14), height: rem(14) }}
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
              }
              onClick={() =>
                onToggleFavorite({ pageId: page.id, isFavorite })
              }
            >
              {isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            </Menu.Item>
            <Menu.Item
              leftSection={
                <Trash2
                  style={{ width: rem(14), height: rem(14) }}
                  color="var(--mantine-color-red-6)"
                />
              }
              color="red"
              onClick={() => onDelete(page.id)}
            >
              휴지통으로 이동
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
}
