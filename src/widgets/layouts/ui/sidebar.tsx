import { useState } from 'react';
import {
  Box,
  ScrollArea,
  Group,
  Text,
  ActionIcon,
  rem,
  NavLink,
} from '@mantine/core';
import { Search, Home, Plus, Trash2 } from 'lucide-react';
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
import { pagesQueryOptions } from '@/entities/pages';
import { PageRow } from './page-row';

const sectionLabelSx = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--mantine-color-notionGray-6)',
  letterSpacing: '0.5px',
};

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

  const handleCreateSubPage = async (parentId: string) => {
    if (!user) return;
    try {
      const { id } = await createPage(parentId);
      navigate({ to: '/page/$pageId', params: { pageId: id } });
    } catch (err) {
      console.error('하위 페이지 생성 실패:', err);
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
    // borderRadius: 'var(--mantine-radius-sm)',
    // '&:hover': {
    //   backgroundColor: 'var(--mantine-color-notionGray-2)',
    // },
  };

  const favoritePageIds = new Set(favoritePages.map((p) => p.id));

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
          // sx={navLinkSx}
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
              <PageRow
                key={page.id}
                page={page}
                currentPageId={currentPageId}
                isFavorite={favoritePageIds.has(page.id)}
                onToggleFavorite={toggleFavorite}
                onDelete={handleDeletePage}
                onCreateSubPage={handleCreateSubPage}
              />
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
          // sx={{
          //   borderRadius: 'var(--mantine-radius-sm)',
          //   '&:hover': { backgroundColor: 'var(--mantine-color-notionGray-2)' },
          // }}
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
              <PageRow
                key={page.id}
                page={page}
                currentPageId={currentPageId}
                isFavorite={favoritePageIds.has(page.id)}
                onToggleFavorite={toggleFavorite}
                onDelete={handleDeletePage}
                onCreateSubPage={handleCreateSubPage}
              />
            ))}
          </Box>
        </ScrollArea>
      </Box>

      {/* Trash */}
      <Box mt="auto" pt="sm">
        <Link
          to="/trash"
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
