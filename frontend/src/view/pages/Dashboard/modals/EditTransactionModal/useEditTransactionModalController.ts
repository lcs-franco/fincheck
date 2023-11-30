import { z } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useBankAccounts } from '../../../../../app/hooks/useBankAccounts';
import { useCategories } from '../../../../../app/hooks/useCategories';
import { Transaction } from '../../../../../app/entities/Transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '../../../../../app/services/transactionsService';
import { currencyStringToNumber } from '../../../../../app/utils/currencyStringToNumber';
import toast from 'react-hot-toast';

const schema = z.object({
  value: z.union([z.string().min(1, 'Informe o valor'), z.number()]),
  name: z.string().min(1, 'Informe o nome'),
  categoryId: z.string().min(1, 'Informe a categoria'),
  bankAccountId: z.string().min(1, 'Informe a conta bancária'),
  date: z.date(),
});

type FormData = z.infer<typeof schema>;

export function useEditTransactionModalController(
  transaction: Transaction | null,
  onClose: () => void
) {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankAccountId: transaction?.bankAccountId,
      categoryId: transaction?.categoryId,
      name: transaction?.name,
      value: transaction?.value,
      date: transaction ? new Date(transaction.date) : new Date(),
    },
  });

  const { accounts } = useBankAccounts();
  const { categories: categoriesList } = useCategories();
  const { isLoading, mutateAsync } = useMutation(transactionsService.update);
  const queryClient = useQueryClient();

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await mutateAsync({
        ...data,
        id: transaction!.id,
        value: currencyStringToNumber(data.value as string),
        type: transaction!.type,
        date: data.date.toISOString(),
      });

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success(
        transaction?.type === 'EXPENSE'
          ? 'Despesa editada com sucesso'
          : 'Receita editada com sucesso'
      );
      onClose();
    } catch {
      toast.error(
        transaction?.type === 'EXPENSE'
          ? 'Erro ao editar a despesa'
          : 'Erro ao editar a receita'
      );
    }
  });

  const categories = useMemo(() => {
    return categoriesList.filter(
      (category) => category.type === transaction?.type
    );
  }, [categoriesList, transaction]);

  return {
    control,
    register,
    errors,
    handleSubmit,
    accounts,
    categories,
    isLoading,
  };
}
