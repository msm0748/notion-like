import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePage } from '../api';
import { pagesKeys } from '@/entities/pages';
import type { PageDto } from '@/entities/pages/type';

export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePage,
    onSuccess: (data) => {
      // list 캐시 내 해당 페이지 title만 직접 업데이트 — refetch 없음
      queryClient.setQueriesData<PageDto[]>(
        { queryKey: pagesKeys.lists() },
        (old) => old?.map((p) => (p.id === data.id ? { ...p, title: data.title } : p)),
      );
      // detail 캐시 직접 업데이트
      queryClient.setQueryData(pagesKeys.detail(data.id), data);
    },
  });
};
