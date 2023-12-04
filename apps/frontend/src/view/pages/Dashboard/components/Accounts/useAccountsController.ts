import { useMemo, useState } from 'react';

import { useDashboard } from '../DashboardContext/useDashboard';
import { useWindowWidth } from '../../../../../app/hooks/useWindowWidth';
import { useBankAccounts } from '../../../../../app/hooks/useBankAccounts';

export function useAccountsController() {
  const windowWidth = useWindowWidth();
  const { areValuesVisible, toggleValuesVisibility, openNewAccountModal } =
    useDashboard();

  const [sliderState, setSliderState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const { accounts, isFetching } = useBankAccounts();

  const currencyBalance = useMemo(() => {
    return accounts.reduce(
      (total, accounts) => total + accounts.currentBalance,
      0
    );
  }, [accounts]);

  return {
    sliderState,
    setSliderState,
    windowWidth,
    areValuesVisible,
    toggleValuesVisibility,
    isLoading: isFetching,
    accounts,
    openNewAccountModal,
    currencyBalance,
  };
}
