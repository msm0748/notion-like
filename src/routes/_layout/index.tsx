import {
  Box,
  Text,
  Group,
  rem,
  SimpleGrid,
  UnstyledButton,
  Stack,
  Skeleton,
} from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { FileText, Plus, Clock, Star } from 'lucide-react';
import { useAuth } from '@/entities/auth';
import { pagesQueryOptions } from '@/entities/pages';
import { useCreatePageMutation } from '@/features/pages';
import { DEFAULT_TITLE } from '@/shared/conf/constant';
import type { PageDto } from '@/entities/pages/type';

export const Route = createFileRoute('/_layout/')({
  component: RouteComponent,
});

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return '좋은 아침이에요';
  if (hour >= 12 && hour < 18) return '좋은 오후예요';
  if (hour >= 18 && hour < 22) return '좋은 저녁이에요';
  return '안녕하세요';
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

function PageCard({ page }: { page: PageDto }) {
  const navigate = useNavigate();

  return (
    <UnstyledButton
      onClick={() => navigate({ to: '/page/$pageId', params: { pageId: page.id } })}
      sx={{
        display: 'block',
        width: '100%',
        padding: '16px',
        borderRadius: 'var(--mantine-radius-md)',
        border: '1px solid var(--mantine-color-notionGray-3)',
        backgroundColor: 'var(--mantine-color-notionGray-0)',
        transition: 'background-color 120ms ease, box-shadow 120ms ease',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'var(--mantine-color-notionGray-1)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Stack gap={10}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 'var(--mantine-radius-sm)',
            backgroundColor: 'var(--mantine-color-notionGray-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <FileText
            style={{ width: rem(17), height: rem(17) }}
            color="var(--mantine-color-notionGray-6)"
          />
        </Box>
        <Box>
          <Text
            size="sm"
            fw={500}
            c="var(--mantine-color-notionGray-7)"
            truncate
            style={{ lineHeight: 1.4 }}
          >
            {page.title?.trim() || DEFAULT_TITLE}
          </Text>
          <Group gap={4} mt={4} wrap="nowrap">
            <Clock
              style={{ width: rem(11), height: rem(11), flexShrink: 0 }}
              color="var(--mantine-color-notionGray-5)"
            />
            <Text size="xs" c="var(--mantine-color-notionGray-5)">
              {getRelativeTime(page.updatedAt)}
            </Text>
          </Group>
        </Box>
      </Stack>
    </UnstyledButton>
  );
}

function RouteComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const greeting = getGreeting();
  const displayName = user?.full_name?.split(' ')[0] ?? user?.name ?? '사용자';

  const { data: pages = [], isLoading } = useQuery(pagesQueryOptions.list());
  const { data: favoritePages = [] } = useQuery(pagesQueryOptions.favorites());
  const { mutateAsync: createPage } = useCreatePageMutation();

  const recentPages = pages.slice(0, 6);

  const handleCreatePage = async () => {
    const { id } = await createPage();
    navigate({ to: '/page/$pageId', params: { pageId: id } });
  };

  return (
    <Box
      style={{
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <Box
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '72px 54px 80px',
        }}
      >
        {/* Greeting */}
        <Box mb={48}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: 'var(--mantine-color-notionGray-7)',
              lineHeight: 1.3,
              letterSpacing: '-0.3px',
            }}
          >
            {greeting}, {displayName}님
          </Text>
          <Text size="sm" c="var(--mantine-color-notionGray-5)" mt={6}>
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </Text>
        </Box>

        {/* Favorites Section */}
        {favoritePages.length > 0 && (
          <Box mb={44}>
            <Group gap={6} mb={14}>
              <Star
                style={{ width: rem(13), height: rem(13) }}
                color="var(--mantine-color-notionGray-5)"
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: 'var(--mantine-color-notionGray-5)',
                  textTransform: 'uppercase',
                }}
              >
                즐겨찾기
              </Text>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={10}>
              {favoritePages.slice(0, 3).map((page) => (
                <PageCard key={page.id} page={page} />
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Recent Pages Section */}
        <Box mb={44}>
          <Group gap={6} mb={14}>
            <Clock
              style={{ width: rem(13), height: rem(13) }}
              color="var(--mantine-color-notionGray-5)"
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'var(--mantine-color-notionGray-5)',
                textTransform: 'uppercase',
              }}
            >
              최근 페이지
            </Text>
          </Group>

          {isLoading ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={10}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height={96} radius="md" />
              ))}
            </SimpleGrid>
          ) : recentPages.length === 0 ? (
            <Box
              sx={{
                padding: '40px 24px',
                borderRadius: 'var(--mantine-radius-md)',
                border: '1px dashed var(--mantine-color-notionGray-3)',
                textAlign: 'center',
              }}
            >
              <FileText
                style={{ width: rem(28), height: rem(28), margin: '0 auto 10px' }}
                color="var(--mantine-color-notionGray-4)"
              />
              <Text size="sm" c="var(--mantine-color-notionGray-5)">
                아직 작성한 페이지가 없어요
              </Text>
              <Text size="xs" c="var(--mantine-color-notionGray-4)" mt={4}>
                아래 버튼으로 첫 페이지를 만들어보세요
              </Text>
            </Box>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={10}>
              {recentPages.map((page) => (
                <PageCard key={page.id} page={page} />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Quick Action */}
        <Box>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--mantine-color-notionGray-5)',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            빠른 시작
          </Text>
          <UnstyledButton
            onClick={handleCreatePage}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 'var(--mantine-radius-md)',
              border: '1px solid var(--mantine-color-notionGray-3)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 120ms ease',
              '&:hover': {
                backgroundColor: 'var(--mantine-color-notionGray-1)',
              },
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 'var(--mantine-radius-sm)',
                backgroundColor: 'var(--mantine-color-notionGray-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Plus
                style={{ width: rem(14), height: rem(14) }}
                color="var(--mantine-color-notionGray-6)"
              />
            </Box>
            <Text size="sm" fw={400} c="var(--mantine-color-notionGray-7)">
              새 페이지 만들기
            </Text>
          </UnstyledButton>
        </Box>
      </Box>
    </Box>
  );
}
