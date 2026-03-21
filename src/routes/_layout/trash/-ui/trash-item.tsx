import { Group, Text, ActionIcon, rem } from '@mantine/core';
import { FileText, RotateCcw, X } from 'lucide-react';
import { DEFAULT_TITLE } from '@/shared/conf/constant';
import type { PageDto } from '@/entities/pages/type';

export function TrashItem({
  page,
  onRestore,
  onPermanentDelete,
}: {
  page: PageDto;
  onRestore: (id: string) => void;
  onPermanentDelete: () => void;
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
          onClick={onPermanentDelete}
          aria-label="영구 삭제"
          title="영구 삭제"
        >
          <X style={{ width: rem(14), height: rem(14) }} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
