import { useMutation, useQueryClient } from '@tanstack/react-query';
import { permanentlyDeleteAllTrashedPages } from '../api';
import { pagesKeys } from '@/entities/pages';

export const usePermanentDeleteAllMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: permanentlyDeleteAllTrashedPages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all });
    },
  });
};
