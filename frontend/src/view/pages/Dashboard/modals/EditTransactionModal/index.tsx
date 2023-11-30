import { Controller } from 'react-hook-form';

import { Button } from '../../../../components/Button';
import { DataPickerInput } from '../../../../components/DataPickerInput';
import { Input } from '../../../../components/Input';
import { InputCurrency } from '../../../../components/InputCurrency';
import { Modal } from '../../../../components/Modal';
import { Select } from '../../../../components/Select';
import { useEditTransactionModalController } from './useEditTransactionModalController';
import { Transaction } from '../../../../../app/entities/Transaction';
import { DeleteModal } from '../../../../components/DeleteModal';
import { TrashIcon } from '../../../../components/icons/TrashIcon';

interface EditTransactionModalProps {
  open: boolean;
  onClose(): void;
  transaction: Transaction | null;
}

export function EditTransactionModal({
  transaction,
  onClose,
  open,
}: EditTransactionModalProps) {
  const {
    control,
    errors,
    handleSubmit,
    accounts,
    register,
    isLoading,
    categories,
    isDeleteModalOpen,
    loadingDelete,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteTransaction,
  } = useEditTransactionModalController(transaction, onClose);

  const isExpense = transaction?.type === 'EXPENSE';

  if (isDeleteModalOpen) {
    return (
      <DeleteModal
        onConfirm={handleDeleteTransaction}
        onClose={handleCloseDeleteModal}
        isLoading={loadingDelete}
        title={`Ter certeza que deseja excluir essa ${
          isExpense ? 'despesa' : 'receita'
        } ?`}
      />
    );
  }

  return (
    <Modal
      title={isExpense ? 'Editar despesa' : 'Editar Receita'}
      open={open}
      onClose={onClose}
      rightAction={
        <button onClick={handleOpenDeleteModal}>
          <TrashIcon className="w-6 h-6 text-red-900" />
        </button>
      }
    >
      <form onSubmit={handleSubmit}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 tracking-[-0.5px] text-lg">R$</span>
            <Controller
              control={control}
              name="value"
              defaultValue="0"
              render={({ field: { onChange, value } }) => (
                <InputCurrency
                  error={errors.value?.message}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <Input
            type="text"
            placeholder={isExpense ? 'Nome da Despesa' : 'Nome da Receita'}
            error={errors.name?.message}
            {...register('name')}
          />

          <Controller
            control={control}
            name="categoryId"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Categoria"
                onChange={onChange}
                value={value}
                error={errors.categoryId?.message}
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
            )}
          />

          <Controller
            control={control}
            name="bankAccountId"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder={isExpense ? 'Pagar com' : 'Receber com'}
                onChange={onChange}
                value={value}
                error={errors.bankAccountId?.message}
                options={accounts.map((account) => ({
                  value: account.id,
                  label: account.name,
                }))}
              />
            )}
          />

          <Controller
            control={control}
            name="date"
            defaultValue={new Date()}
            render={({ field: { value, onChange } }) => (
              <DataPickerInput
                value={value}
                onChange={onChange}
                error={errors.date?.message}
              />
            )}
          />

          <Button type="submit" className="w-full mt-6" isPending={isLoading}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
