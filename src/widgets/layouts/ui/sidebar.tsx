import { useState } from 'react';
import {
  Box,
  ScrollArea,
  Group,
  Text,
  ActionIcon,
  Menu,
  rem,
  NavLink,
} from '@mantine/core';
import {
  Search,
  Home,
  Plus,
  Trash2,
  MoreVertical,
  FileText,
  Star,
} from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { UserProfileMenu } from '@/features/auth';
import { useAuth } from '@/entities/auth';
import { Link } from '@/shared/ui/link';
import {
  useCreatePageMutation,
  useDeletePageMutation,
  useToggleFavoriteMutation,
  SearchModal,
} from '@/features/pages';
import { DEFAULT_TITLE } from '@/shared/conf/constant';
import { pagesQueryOptions } from '@/entities/pages';

export function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchOpened, setSearchOpened] = useState(false);

  const { data: pages = [] } = useQuery({
    ...pagesQueryOptions.list(),
    enabled: !!user,
  });

  const { data: favoritePages = [] } = useQuery({
    ...pagesQueryOptions.favorites(),
    enabled: !!user,
  });

  const { mutateAsync: createPage } = useCreatePageMutation();
  const { mutateAsync: deletePage } = useDeletePageMutation();
  const { mutate: toggleFavorite } = useToggleFavoriteMutation();
  const { pageId: currentPageId } = useParams({ strict: false });

  const handleAddPage = async () => {
    if (!user) return;
    try {
      const { id } = await createPage();
      navigate({ to: '/page/$pageId', params: { pageId: id } });
    } catch (err) {
      console.error('페이지 생성 실패:', err);
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      await deletePage(id);
      if (currentPageId === id) {
        navigate({ to: '/' });
      }
    } catch (err) {
      console.error('페이지 삭제 실패:', err);
    }
  };

  const navLinkSx = {
    borderRadius: 'var(--mantine-radius-sm)',
    '&:hover': {
      backgroundColor: 'var(--mantine-color-notionGray-2)',
    },
  };

  const sectionLabelSx = {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--mantine-color-notionGray-6)',
    letterSpacing: '0.5px',
  };

  const favoritePageIds = new Set(favoritePages.map((p) => p.id));

  const PageRow = ({ page }: { page: (typeof pages)[number] }) => {
    const isActive = currentPageId === page.id;
    const isFavorite = favoritePageIds.has(page.id);

    return (
      <Box
        key={page.id}
        className="sidebar-page-row"
        sx={{
          width: '100%',
          minWidth: 0,
          borderRadius: 'var(--mantine-radius-sm)',
          position: 'relative',
          backgroundColor: isActive
            ? 'var(--mantine-color-notionGray-2)'
            : 'transparent',
          '&:hover': {
            backgroundColor: 'var(--mantine-color-notionGray-2)',
          },
          '&:hover .page-actions': {
            opacity: 1,
          },
        }}
      >
        <Group
          wrap="nowrap"
          gap={6}
          style={{ width: '100%', minWidth: 0 }}
          align="center"
        >
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
              sx={{
                '&[data-status="active"]': {
                  backgroundColor: 'inherit',
                },
                '&:hover': {
                  backgroundColor: 'inherit',
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
                onClick={() => toggleFavorite({ pageId: page.id, isFavorite })}
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
                onClick={() => handleDeletePage(page.id)}
              >
                삭제
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Box>
    );
  };

  return (
    <Box p="sm" h="100%" display="flex" sx={{ flexDirection: 'column' }}>
      {/* User Section */}
      <Box mb="xs">
        {user && (
          <UserProfileMenu
            user={{
              email: user.email,
              name: user.full_name,
              avatar_url: user.avatar_url,
            }}
          />
        )}
      </Box>

      {/* Main Nav */}
      <Box display="flex" sx={{ flexDirection: 'column', gap: '2px' }}>
        <NavLink
          label={
            <Text size="sm" fw={400} c="var(--mantine-color-notionGray-7)">
              Search
            </Text>
          }
          leftSection={
            <Search
              style={{ width: rem(16), height: rem(16) }}
              color="var(--mantine-color-notionGray-6)"
            />
          }
          onClick={() => setSearchOpened(true)}
          sx={navLinkSx}
        />
        <Link
          to="/"
          label={
            <Text size="sm" fw={400} c="var(--mantine-color-notionGray-7)">
              Home
            </Text>
          }
          leftSection={
            <Home
              style={{ width: rem(16), height: rem(16) }}
              color="var(--mantine-color-notionGray-6)"
            />
          }
          sx={navLinkSx}
        />
      </Box>

      {/* Favorites Section */}
      {favoritePages.length > 0 && (
        <Box mt="md">
          <Box px="xs" py="6px">
            <Text component="span" style={sectionLabelSx}>
              Favorites
            </Text>
          </Box>
          <Box
            display="flex"
            sx={{ flexDirection: 'column', gap: '1px' }}
            pt={2}
          >
            {favoritePages.map((page) => (
              <PageRow key={page.id} page={page} />
            ))}
          </Box>
        </Box>
      )}

      {/* Pages Section */}
      <Box
        flex={1}
        display="flex"
        sx={{ flexDirection: 'column' }}
        mih={0}
        mt="md"
      >
        <Box
          onClick={handleAddPage}
          style={{ width: '100%', cursor: 'pointer' }}
          sx={{
            borderRadius: 'var(--mantine-radius-sm)',
            '&:hover': { backgroundColor: 'var(--mantine-color-notionGray-2)' },
          }}
        >
          <Group justify="space-between" px="xs" py="6px" wrap="nowrap">
            <Text component="span" style={sectionLabelSx}>
              Private
            </Text>
            <ActionIcon
              component="div"
              variant="subtle"
              color="gray"
              size="sm"
              aria-label="새 페이지"
              style={{ opacity: 0.7 }}
            >
              <Plus
                style={{ width: rem(14), height: rem(14) }}
                color="var(--mantine-color-notionGray-6)"
              />
            </ActionIcon>
          </Group>
        </Box>

        <ScrollArea flex={1} offsetScrollbars type="hover" scrollbarSize={6}>
          <Box
            display="flex"
            sx={{ flexDirection: 'column', gap: '1px' }}
            pt={2}
          >
            {pages.map((page) => (
              <PageRow key={page.id} page={page} />
            ))}
          </Box>
        </ScrollArea>
      </Box>

      {/* Trash */}
      <Box mt="auto" pt="sm">
        <Link
          to="/"
          label={
            <Text size="sm" fw={400} c="var(--mantine-color-notionGray-7)">
              Trash
            </Text>
          }
          leftSection={
            <Trash2
              style={{ width: rem(16), height: rem(16) }}
              color="var(--mantine-color-notionGray-6)"
            />
          }
          sx={navLinkSx}
        />
      </Box>

      <SearchModal
        opened={searchOpened}
        onClose={() => setSearchOpened(false)}
      />
    </Box>
  );
}
