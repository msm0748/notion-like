import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePage } from '../api';
import { pagesKeys } from '@/entities/pages';

export const useDeletePageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pageId: string) => deletePage(pageId),
    onSuccess: (_, pageId) => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all });
      queryClient.invalidateQueries({ queryKey: pagesKeys.detail(pageId) });
    },
  });
};
