import { useState } from 'react';

export function useFiltersModal() {
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<
    null | string
  >(null);

  function handleSelectedBankAccount(bankAccountId: string) {
    setSelectedBankAccountId(bankAccountId);
  }

  return { selectedBankAccountId, handleSelectedBankAccount };
}
