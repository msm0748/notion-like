import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restorePage } from '../api';
import { pagesKeys } from '@/entities/pages';

export const useRestorePageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pageId: string) => restorePage(pageId),
    onSuccess: (_, pageId) => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all });
      queryClient.invalidateQueries({ queryKey: pagesKeys.detail(pageId) });
    },
  });
};
