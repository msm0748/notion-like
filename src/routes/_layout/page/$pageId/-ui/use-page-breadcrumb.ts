import { useState, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { pagesQueryOptions } from '@/entities/pages';
import type { PageDto } from '@/entities/pages';

function sortFromRootToLeaf(pages: PageDto[], leafId: string): PageDto[] {
  const map = new Map(pages.map((p) => [p.id, p]));
  const result: PageDto[] = [];

  let current = map.get(leafId);
  while (current) {
    result.unshift(current);
    current = current.parentId ? map.get(current.parentId) : undefined;
  }

  return result;
}

export function usePageBreadcrumb(pageId: string): PageDto[] {
  const [extraIds, setExtraIds] = useState<string[]>([]);

  useEffect(() => {
    setExtraIds([]);
  }, [pageId]);

  const allIds = [pageId, ...extraIds];

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

  const pages = results.map((r) => r.data).filter((p): p is PageDto => !!p);
  return sortFromRootToLeaf(pages, pageId);
}
