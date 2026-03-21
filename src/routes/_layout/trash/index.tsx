import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Box, Text, Group, rem, Stack, Modal, Button } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { pagesQueryOptions } from '@/entities/pages';
import {
  useRestorePageMutation,
  usePermanentDeleteMutation,
} from '@/features/pages';
import { DEFAULT_TITLE } from '@/shared/conf/constant';
import type { PageDto } from '@/entities/pages/type';
import { TrashItem } from './-ui/trash-item';

export const Route = createFileRoute('/_layout/trash/')({
  component: TrashPage,
});

function TrashPage() {
  const { data: trashedPages = [], isLoading } = useQuery(
    pagesQueryOptions.trash(),
  );
  const { mutate: restorePage } = useRestorePageMutation();
  const { mutate: permanentlyDelete } = usePermanentDeleteMutation();
  const [deleteTarget, setDeleteTarget] = useState<PageDto | null>(null);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      permanentlyDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

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
                onPermanentDelete={() => setDeleteTarget(page)}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Modal
        opened={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="영구 삭제"
        centered
        size="sm"
      >
        <Text size="sm" mb="lg">
          <Text component="span" fw={600}>
            {deleteTarget?.title?.trim() || DEFAULT_TITLE}
          </Text>
          을(를) 영구적으로 삭제할까요? 이 작업은 되돌릴 수 없어요.
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={() => setDeleteTarget(null)}>
            취소
          </Button>
          <Button color="red" onClick={handleConfirmDelete}>
            삭제
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
