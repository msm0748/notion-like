import { useState } from 'react';
import { Box, Group, Text, ActionIcon, Menu, rem } from '@mantine/core';
import {
  Trash2,
  MoreVertical,
  FileText,
  Star,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/shared/ui/link';
import { DEFAULT_TITLE } from '@/shared/conf/constant';
import type { PageDto } from '@/entities/pages';
import { pagesQueryOptions } from '@/entities/pages';

interface PageRowProps {
  page: PageDto;
  currentPageId: string | undefined;
  isFavorite: boolean;
  depth?: number;
  onToggleFavorite: (args: { pageId: string; isFavorite: boolean }) => void;
  onDelete: (id: string) => void;
  onCreateSubPage: (parentId: string) => void;
}

export function PageRow({
  page,
  currentPageId,
  isFavorite,
  depth = 0,
  onToggleFavorite,
  onDelete,
  onCreateSubPage,
}: PageRowProps) {
  const isActive = currentPageId === page.id;
  const [expanded, setExpanded] = useState(false);

  const { data: childPages = [] } = useQuery({
    ...pagesQueryOptions.children(page.id),
    enabled: expanded,
  });

  return (
    <>
      <Box
        className="sidebar-page-row"
        sx={{
          width: '100%',
          minWidth: 0,
          borderRadius: 'var(--mantine-radius-sm)',
          position: 'relative',
          '&:hover .page-actions': {
            opacity: 1,
          },
          '&:hover .page-toggle': {
            opacity: 1,
          },
        }}
      >
        <Group
          wrap="nowrap"
          gap={0}
          style={{ width: '100%', minWidth: 0, paddingLeft: depth * 16 }}
          align="center"
        >
          {/* Expand/Collapse toggle */}
          <ActionIcon
            className="page-toggle"
            variant="subtle"
            color="gray"
            size="xs"
            sx={{
              opacity: expanded ? 1 : 0,
              transition: 'opacity 0.12s ease, transform 0.12s ease',
              flexShrink: 0,
              width: 20,
              height: 20,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
          >
            <ChevronRight
              style={{
                width: rem(12),
                height: rem(12),
                transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.12s ease',
              }}
              color="var(--mantine-color-notionGray-6)"
            />
          </ActionIcon>

          <Box style={{ flex: 1, minWidth: 0 }}>
            <Link
              to="/page/$pageId"
              params={{ pageId: page.id }}
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
            />
          </Box>

          {/* Actions: Add sub-page + More menu */}
          <Group gap={2} wrap="nowrap" style={{ flexShrink: 0 }}>
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
                onCreateSubPage(page.id);
              }}
              aria-label="하위 페이지 추가"
            >
              <Plus
                style={{ width: rem(14), height: rem(14) }}
                color="var(--mantine-color-notionGray-6)"
              />
            </ActionIcon>
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
        </Group>
      </Box>

      {/* Children */}
      {expanded &&
        childPages.map((child) => (
          <PageRow
            key={child.id}
            page={child}
            currentPageId={currentPageId}
            isFavorite={false}
            depth={depth + 1}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onCreateSubPage={onCreateSubPage}
          />
        ))}
    </>
  );
}
