import {
  addExcludedAsset,
  getSettings,
  removeExcludedAsset,
  resetCurrentsTo,
  setFiat,
  setLanguage,
  setRates,
  useDispatch,
  useSelector
} from '@store';
import { IRates, ISettings, TFiatTicker, TUuid } from '@types';

export interface ISettingsContext {
  settings: ISettings;
  language: string;
  addAssetToExclusionList(uuid: TUuid): void;
  removeAssetfromExclusionList(uuid: TUuid): void;
  updateSettingsAccounts(accounts: TUuid[]): void;
  updateSettingsRates(rates: IRates): void;
  updateLanguageSelection(language: string): void;
  updateFiatCurrency(fiatTicker: TFiatTicker): void;
  setDemoMode(isDemoMode: boolean): void;
}

function useSettings() {
  const settings = useSelector(getSettings);
  const dispatch = useDispatch();
  const language = settings.language || '';

  const updateSettingsAccounts = (accounts: TUuid[]) => {
    dispatch(resetCurrentsTo(accounts));
  };

  const updateLanguageSelection = (lang: string) => {
    dispatch(setLanguage(lang));
  };

  const updateFiatCurrency = (fiat: TFiatTicker) => {
    dispatch(setFiat(fiat));
  };

  const addAssetToExclusionList = (assetUuid: TUuid): void => {
    dispatch(addExcludedAsset(assetUuid));
  };

  const removeAssetfromExclusionList = (assetUuid: TUuid): void => {
    dispatch(removeExcludedAsset(assetUuid));
  };

  const updateSettingsRates = (rates: IRates) => {
    dispatch(setRates(rates));
  };

  return {
    settings,
    language,
    addAssetToExclusionList,
    removeAssetfromExclusionList,
    updateSettingsAccounts,
    updateSettingsRates,
    updateLanguageSelection,
    updateFiatCurrency
  };
}

export default useSettings;
