import { useState } from 'react';
import { useBankAccounts } from '../../../../../../app/hooks/useBankAccounts';

export function useFiltersModalController() {
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<
    null | string
  >(null);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { accounts } = useBankAccounts();

  function handleSelectedBankAccount(bankAccountId: string) {
    setSelectedBankAccountId((prevState) =>
      prevState === bankAccountId ? null : bankAccountId
    );
  }

  function handleYearChange(step: number) {
    setSelectedYear((prevState) => prevState + step);
  }

  return {
    selectedBankAccountId,
    handleSelectedBankAccount,
    selectedYear,
    handleYearChange,
    accounts,
  };
}
