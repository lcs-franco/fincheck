import { useState } from 'react';
import { useBankAccounts } from '../../../../../../app/hooks/useBankAccounts';

export function useFiltersModal() {
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<
    null | string
  >(null);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  function handleSelectedBankAccount(bankAccountId: string) {
    setSelectedBankAccountId((prevState) =>
      prevState === bankAccountId ? null : bankAccountId
    );
  }

  function handleYearChange(step: number) {
    setSelectedYear((prevState) => prevState + step);
  }

  const { accounts } = useBankAccounts();

  return {
    selectedBankAccountId,
    handleSelectedBankAccount,
    selectedYear,
    handleYearChange,
    accounts,
  };
}
