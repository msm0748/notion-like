import { createFileRoute } from '@tanstack/react-router';
import { Box, Text, Group, ActionIcon, rem, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Trash2, RotateCcw, X, FileText } from 'lucide-react';
import { pagesQueryOptions } from '@/entities/pages';
import { useRestorePageMutation, usePermanentDeleteMutation } from '@/features/pages';
import { DEFAULT_TITLE } from '@/shared/conf/constant';
import type { PageDto } from '@/entities/pages/type';

export const Route = createFileRoute('/_layout/trash/')({
  component: TrashPage,
});

function TrashItem({
  page,
  onRestore,
  onPermanentDelete,
}: {
  page: PageDto;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}) {
  return (
    <Group
      wrap="nowrap"
      gap="sm"
      px="md"
      py="xs"
      sx={{
        borderRadius: 'var(--mantine-radius-sm)',
        '&:hover': {
          backgroundColor: 'var(--mantine-color-notionGray-1)',
        },
      }}
    >
      <FileText
        style={{ width: rem(16), height: rem(16), flexShrink: 0 }}
        color="var(--mantine-color-notionGray-5)"
      />
      <Text size="sm" truncate style={{ flex: 1 }}>
        {page.title?.trim() || DEFAULT_TITLE}
      </Text>
      <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={() => onRestore(page.id)}
          aria-label="복원"
          title="복원"
        >
          <RotateCcw style={{ width: rem(14), height: rem(14) }} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="red"
          size="sm"
          onClick={() => onPermanentDelete(page.id)}
          aria-label="영구 삭제"
          title="영구 삭제"
        >
          <X style={{ width: rem(14), height: rem(14) }} />
        </ActionIcon>
      </Group>
    </Group>
  );
}

function TrashPage() {
  const { data: trashedPages = [], isLoading } = useQuery(
    pagesQueryOptions.trash(),
  );
  const { mutate: restorePage } = useRestorePageMutation();
  const { mutate: permanentlyDelete } = usePermanentDeleteMutation();

  return (
    <Box h="100%" display="flex" sx={{ flexDirection: 'column' }}>
      <Box
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '72px 54px 80px',
          width: '100%',
        }}
      >
        <Group gap={10} mb={32}>
          <Trash2
            style={{ width: rem(24), height: rem(24) }}
            color="var(--mantine-color-notionGray-6)"
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--mantine-color-notionGray-7)',
            }}
          >
            휴지통
          </Text>
        </Group>

        {isLoading ? null : trashedPages.length === 0 ? (
          <Box
            sx={{
              padding: '60px 24px',
              textAlign: 'center',
            }}
          >
            <Trash2
              style={{
                width: rem(36),
                height: rem(36),
                margin: '0 auto 12px',
              }}
              color="var(--mantine-color-notionGray-3)"
            />
            <Text size="sm" c="var(--mantine-color-notionGray-5)">
              휴지통이 비어있어요
            </Text>
          </Box>
        ) : (
          <Stack gap={2}>
            {trashedPages.map((page) => (
              <TrashItem
                key={page.id}
                page={page}
                onRestore={(id) => restorePage(id)}
                onPermanentDelete={(id) => permanentlyDelete(id)}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
