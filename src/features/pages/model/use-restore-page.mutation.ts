import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restorePage } from '../api';
import { pagesKeys } from '@/entities/pages';

export const useRestorePageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pageId: string) => restorePage(pageId),
    onSuccess: ({ resolvedParentId }, pageId) => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all });
      // 복구된 페이지의 detail 캐시 제거 (stale 상태로 재진입 시 fresh 데이터 보장)
      queryClient.removeQueries({ queryKey: pagesKeys.detail(pageId) });
      // 부모 페이지가 있으면 해당 detail 캐시도 제거 (에디터가 새 content로 초기화되도록)
      if (resolvedParentId) {
        queryClient.removeQueries({ queryKey: pagesKeys.detail(resolvedParentId) });
      }
    },
  });
};
