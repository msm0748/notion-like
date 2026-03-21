import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFavorite, removeFavorite } from '@/entities/pages/api';
import { pagesKeys } from '@/entities/pages';
import type { PageDto } from '@/entities/pages/type';

export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pageId, isFavorite }: { pageId: string; isFavorite: boolean }) =>
      isFavorite ? removeFavorite(pageId) : addFavorite(pageId),
    onSuccess: (_, { pageId, isFavorite }) => {
      // 즐겨찾기 목록 refetch
      queryClient.invalidateQueries({ queryKey: pagesKeys.favorites() });
      // detail 캐시에 isFavorite 반영
      queryClient.setQueryData<PageDto>(
        pagesKeys.detail(pageId),
        (old) => (old ? { ...old, isFavorite: !isFavorite } : old),
      );
    },
  });
};
