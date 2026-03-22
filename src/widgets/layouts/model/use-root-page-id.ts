import { useState, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { pagesQueryOptions } from '@/entities/pages';

export function useRootPageId(
  currentPageId: string | undefined,
): string | undefined {
  const [extraIds, setExtraIds] = useState<string[]>([]);

  useEffect(() => {
    setExtraIds([]);
  }, [currentPageId]);

  const allIds = currentPageId ? [currentPageId, ...extraIds] : [];

  const results = useQueries({
    queries: allIds.map((id) => pagesQueryOptions.detail(id)),
  });

  useEffect(() => {
    results.forEach((r) => {
      if (r.data?.parentId && !allIds.includes(r.data.parentId)) {
        setExtraIds((prev) =>
          prev.includes(r.data!.parentId!) ? prev : [...prev, r.data!.parentId!],
        );
      }
    });
  });

  // parentId가 없는 페이지가 루트
  const root = results.map((r) => r.data).find((p) => p && !p.parentId);
  return root?.id ?? currentPageId;
}
