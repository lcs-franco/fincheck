import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { AccountCard } from './AccountCard';
import { AccountsSliderNavigation } from './AccountsSliderNavigation';
import { EyeIcon } from '../../../components/icons/EyeIcon';
import { useAccountsController } from './useAccountsController';
import { formatCurrency } from '../../../../app/utils/formatCurrency';
import { cn } from '../../../../app/utils/cn';

export function Accounts() {
  const {
    setSliderState,
    sliderState,
    windowWidth,
    areValuesVisible,
    toggleValuesVisibility,
  } = useAccountsController();

  return (
    <div className="bg-teal-900 rounded-2xl w-full h-full md:p-10 px-4 py-8 flex flex-col">
      <div>
        <span className="tracking-[-0.5px] text-white block">Salto total</span>

        <div className="flex items-center gap-2">
          <strong
            className={cn(
              'tracking-[-1px] text-2xl text-white',
              !areValuesVisible && 'blur-md'
            )}
          >
            {formatCurrency(1000)}
          </strong>

          <button
            onClick={toggleValuesVisibility}
            className="w-8 h-8 flex items-center justify-center"
          >
            <EyeIcon open={!areValuesVisible} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end mt-10 md:mt-0">
        <div>
          <Swiper
            spaceBetween={16}
            slidesPerView={windowWidth >= 500 ? 2.1 : 1.2}
            onSlideChange={(swiper) => {
              setSliderState({
                isBeginning: swiper.isBeginning,
                isEnd: swiper.isEnd,
              });
            }}
          >
            <div
              className="flex items-center justify-between mb-4"
              slot="container-start"
            >
              <strong className="text-white tracking-[-1px] text-lg font-bold">
                Minhas contas
              </strong>

              <AccountsSliderNavigation
                isBeginning={sliderState.isBeginning}
                isEnd={sliderState.isEnd}
              />
            </div>

            <SwiperSlide>
              <AccountCard
                balance={1000.23}
                color="#7950F2"
                name="Nubank"
                type="CHECKING"
              />
            </SwiperSlide>

            <SwiperSlide>
              <AccountCard
                balance={1000.23}
                color="#333"
                name="XP Investimentos"
                type="INVESTMENT"
              />
            </SwiperSlide>

            <SwiperSlide>
              <AccountCard
                balance={1000.23}
                color="#0f0"
                name="Carteira"
                type="CASH"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
