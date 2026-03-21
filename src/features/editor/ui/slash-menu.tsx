import { Fragment } from 'react';
import { Box, Text } from '@mantine/core';
import type { SuggestionMenuProps } from '@blocknote/react';
import type { DefaultReactSuggestionItem } from '@blocknote/react';

type SlashMenuItem = DefaultReactSuggestionItem & { onItemClick: () => void };

export function SlashMenu({
  items,
  selectedIndex,
  onItemClick,
}: SuggestionMenuProps<SlashMenuItem>) {
  // Group items preserving order of first appearance
  const groups: { name: string; items: (SlashMenuItem & { index: number })[] }[] = [];
  const groupMap = new Map<string, number>();

  items.forEach((item, index) => {
    const groupName = item.group ?? 'Other';
    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, groups.length);
      groups.push({ name: groupName, items: [] });
    }
    groups[groupMap.get(groupName)!].items.push({ ...item, index });
  });

  if (items.length === 0) return null;

  return (
    <Box
      sx={{
        backgroundColor: 'var(--mantine-color-body)',
        borderRadius: 8,
        boxShadow:
          '0 4px 24px rgba(0,0,0,0.12), 0 1px 6px rgba(0,0,0,0.06)',
        border: '1px solid var(--mantine-color-gray-2)',
        width: 300,
        maxHeight: 440,
        overflowY: 'auto',
        padding: '6px 0',
        scrollbarWidth: 'thin',
      }}
    >
      {groups.map((group) => (
        <Fragment key={group.name}>
          <Text
            size="xs"
            c="dimmed"
            fw={500}
            px={12}
            pt={8}
            pb={4}
            sx={{ userSelect: 'none', letterSpacing: '0.01em' }}
          >
            {group.name}
          </Text>

          {group.items.map((item) => {
            const isSelected = item.index === selectedIndex;
            return (
              <Box
                key={item.index}
                onClick={() => {
                  item.onItemClick();
                  onItemClick?.(item);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: isSelected
                    ? 'var(--mantine-color-gray-1)'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-gray-1)',
                  },
                }}
              >
                {/* Icon box */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    backgroundColor: 'var(--mantine-color-body)',
                    border: '1px solid var(--mantine-color-gray-3)',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--mantine-color-dark-6)',
                    '& svg': { width: 20, height: 20 },
                  }}
                >
                  {item.icon}
                </Box>

                {/* Title + description */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={500} lh={1.3}>
                    {item.title}
                  </Text>
                  {item.subtext && (
                    <Text size="xs" c="dimmed" lh={1.3}>
                      {item.subtext}
                    </Text>
                  )}
                </Box>

                {/* Keyboard shortcut badge */}
                {item.badge && (
                  <Text
                    size="xs"
                    c="dimmed"
                    sx={{ flexShrink: 0, fontFamily: 'inherit' }}
                  >
                    {item.badge}
                  </Text>
                )}
              </Box>
            );
          })}
        </Fragment>
      ))}
    </Box>
  );
}
