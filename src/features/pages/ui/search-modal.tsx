import { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Box,
  Text,
  Group,
  rem,
  UnstyledButton,
} from '@mantine/core';
import { Search, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { pagesQueryOptions } from '@/entities/pages';
import { DEFAULT_TITLE } from '@/shared/conf/constant';

interface SearchModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SearchModal({ opened, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 100);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!opened) {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [opened]);

  const { data: results = [], isFetching } = useQuery({
    ...pagesQueryOptions.search(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const handleSelect = (pageId: string) => {
    navigate({ to: '/page/$pageId', params: { pageId } });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      size="lg"
      padding={0}
      radius="md"
      overlayProps={{ backgroundOpacity: 0.3, blur: 2 }}
      styles={{
        content: { overflow: 'hidden' },
      }}
    >
      <Box>
        <TextInput
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="페이지 검색..."
          leftSection={
            <Search
              style={{ width: rem(16), height: rem(16) }}
              color="var(--mantine-color-notionGray-6)"
            />
          }
          styles={{
            input: {
              border: 'none',
              borderBottom: '1px solid var(--mantine-color-notionGray-3)',
              borderRadius: 0,
              fontSize: '15px',
              padding: '18px 16px 18px 40px',
              height: 'auto',
              '&:focus': { outline: 'none' },
            },
            section: { paddingLeft: rem(14) },
          }}
        />

        <Box mah={400} style={{ overflowY: 'auto' }}>
          {debouncedQuery.length === 0 ? (
            <Box py="xl" style={{ textAlign: 'center' }}>
              <Text size="sm" c="var(--mantine-color-notionGray-5)">
                검색어를 입력하세요
              </Text>
            </Box>
          ) : isFetching ? (
            <Box py="xl" style={{ textAlign: 'center' }}>
              <Text size="sm" c="var(--mantine-color-notionGray-5)">
                검색 중...
              </Text>
            </Box>
          ) : results.length === 0 ? (
            <Box py="xl" style={{ textAlign: 'center' }}>
              <Text size="sm" c="var(--mantine-color-notionGray-5)">
                검색 결과가 없습니다
              </Text>
            </Box>
          ) : (
            <Box py="xs">
              <Text
                size="xs"
                fw={600}
                c="var(--mantine-color-notionGray-5)"
                px="md"
                pb="xs"
                style={{ letterSpacing: '0.5px' }}
              >
                페이지
              </Text>
              {results.map((page) => (
                <UnstyledButton
                  key={page.id}
                  onClick={() => handleSelect(page.id)}
                  style={{ width: '100%' }}
                  sx={{
                    padding: '8px 16px',
                    '&:hover': {
                      backgroundColor: 'var(--mantine-color-notionGray-1)',
                    },
                  }}
                >
                  <Group gap={10} wrap="nowrap">
                    <FileText
                      style={{
                        width: rem(15),
                        height: rem(15),
                        flexShrink: 0,
                        color: 'var(--mantine-color-notionGray-5)',
                      }}
                    />
                    <Text size="sm" truncate>
                      {page.title?.trim() || DEFAULT_TITLE}
                    </Text>
                  </Group>
                </UnstyledButton>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
