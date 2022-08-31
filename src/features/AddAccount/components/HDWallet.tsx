import { useState } from 'react';

import { DerivationPath as DPath } from '@mycrypto/wallets';
import { Formik } from 'formik';
import styled from 'styled-components';
import { object, string } from 'yup';

import {
  AssetSelector,
  Box,
  Button,
  Input,
  LinkApp,
  PoweredByText,
  Switch,
  Text,
  Typography
} from '@components';
import { Downloader } from '@components/Downloader';
import { default as Icon } from '@components/Icon';
import { DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN } from '@config';
import { DWAccountDisplay, ExtendedDPath, isValidPath } from '@services';
import { useSelector } from '@store';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { Trans, translateRaw } from '@translations';
import { ExtendedAsset, IAccountAdditionData, Network } from '@types';
import { filterValidAssets, sortByTicker, useScreenSize } from '@utils';

import { DPathSelector } from './DPathSelector';
import { selectHDWalletScannedAccountsCSV } from './hdWallet.slice';
import HDWList from './HDWList';

const MnemonicWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  color: ${COLORS.BLUE_DARK};
  font-size: ${FONT_SIZE.XXL};
  font-weight: bold;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-size: ${FONT_SIZE.XL};
  }
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: -25px;
  margin-bottom: ${SPACING.BASE};
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    margin-left: 0px;
    align-items: flex-start;
  }
`;

const SForm = styled.form`
  width: 50%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
`;

const SLabel = styled.label`
  font-weight: normal;
  margin-bottom: ${SPACING.SM};
  margin-top: ${SPACING.MD};
`;

const SButton = styled(Button)`
  margin: ${SPACING.MD} 0;
`;

const SDownloader = styled(Downloader)`
  color: ${COLORS.BLUE_MYC};
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: ${COLORS.BLUE_LIGHT_DARKISH};
  }
`;

const SIcon = styled(Icon)`
  cursor: pointer;
  margin-right: ${SPACING.SM};
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-bottom: ${SPACING.SM};
  }
`;

const Error = styled.span`
  min-height: 22px;
  color: ${COLORS.ERROR_RED};
`;

const SInput = styled(Input)`
  margin-bottom: ${SPACING.XS};
`;

const SButtonContainer = styled(Box)`
  @media screen and (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-left: -25px;
    margin-right: -25px;
  }
`;

export interface HDWalletProps {
  selectedAsset: ExtendedAsset;
  scannedAccounts: DWAccountDisplay[];
  isCompleted: boolean;
  assets: ExtendedAsset[];
  assetToUse: ExtendedAsset;
  network: Network;
  dpaths: DPath[];
  selectedDPath: DPath;
  setSelectedDPath(dpath: DPath): void;
  updateAsset(asset: ExtendedAsset): void;
  addDPaths(dpaths: ExtendedDPath[]): void;
  scanMoreAddresses(dpath: ExtendedDPath): void;
  handleAssetUpdate(asset: ExtendedAsset): void;
  onUnlock(param: IAccountAdditionData[]): void;
}

interface FormValues {
  name: string;
  path: string;
}

const initialFormikValues: FormValues = {
  name: '',
  path: ''
};

const CUSTOM_DERIVATION_PATH_SCHEMA = object().shape({
  name: string().required(translateRaw('REQUIRED')),
  path: string()
    .required(translateRaw('REQUIRED'))
    .test('check-valid-path', translateRaw('DETERMINISTIC_INVALID_DPATH'), (value) =>
      isValidPath(value)
    )
});

const HDWallet = ({
  selectedAsset,
  scannedAccounts,
  isCompleted,
  assets,
  assetToUse,
  network,
  dpaths,
  selectedDPath,
  setSelectedDPath,
  updateAsset,
  addDPaths,
  scanMoreAddresses,
  handleAssetUpdate,
  onUnlock
}: HDWalletProps) => {
  const csv = useSelector(selectHDWalletScannedAccountsCSV) ?? '';
  const { isMobile } = useScreenSize();
  const [dpathAddView, setDpathAddView] = useState(false);
  const [displayEmptyAddresses, setDisplayEmptyAddresses] = useState(false);

  const handleDPathAddition = (values: FormValues) => {
    addDPaths([
      {
        ...values,
        path: values.path + '/<account>',
        offset: 0,
        numOfAddresses: DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN
      }
    ]);
    setDpathAddView(false);
  };

  const handleToggleShowEmptyAddresses = () => setDisplayEmptyAddresses((value) => !value);

  const relevantAssets = network ? filterValidAssets(assets, network.id) : [];
  const filteredAssets = sortByTicker(relevantAssets);

  return dpathAddView ? (
    <MnemonicWrapper>
      <HeadingWrapper>
        <SIcon type="back" width={20} onClick={() => setDpathAddView(false)} />
        <Title>
          <Trans id="DETERMINISTIC_CUSTOM_TITLE" />
        </Title>
      </HeadingWrapper>
      <Typography>{translate('DETERMINISTIC_CUSTOM_GET_INFORMED')}</Typography>
      <Formik
        initialValues={initialFormikValues}
        onSubmit={handleDPathAddition}
        validationSchema={CUSTOM_DERIVATION_PATH_SCHEMA}
      >
        {({ errors, touched, handleChange, handleBlur, values, isSubmitting, handleSubmit }) => (
          <SForm onSubmit={handleSubmit}>
            <SLabel htmlFor="name">
              <Trans id="DETERMINISTIC_CUSTOM_LABEL" />
            </SLabel>
            <SInput
              placeholder="Custom Path"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={!errors.name}
              showInvalidWithoutValue={true}
            />
            <Error>{errors && touched.name && errors.name}</Error>
            <SLabel htmlFor="path">
              <Trans id="DETERMINISTIC_CUSTOM_LABEL_DPATH" />
            </SLabel>
            <SInput
              placeholder="m/44’/60’/0’/0’"
              name="path"
              value={values.path}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={!errors.path}
              showInvalidWithoutValue={true}
            />
            <Error>{errors && touched.path && errors.path}</Error>
            <SButton fullwidth={isMobile} disabled={isSubmitting} type="submit">
              <Trans id="DETERMINISTIC_ADD_DPATH" />
            </SButton>
          </SForm>
        )}
      </Formik>
      <Typography>
        <Trans id="DETERMINISTIC_SEE_SUMMARY" />{' '}
        <SDownloader data={csv} fileName="accounts.csv" mime="text/csv">
          <Trans id="HERE" />
        </SDownloader>
        .
      </Typography>
    </MnemonicWrapper>
  ) : (
    <MnemonicWrapper>
      <HeadingWrapper>
        <Title>
          <Trans id="MNEMONIC_TITLE" />
        </Title>
      </HeadingWrapper>

      <SButtonContainer
        pb={SPACING.MD}
        variant={isMobile ? 'columnAlign' : 'rowAlign'}
        justifyContent="space-between"
      >
        <Box variant="columnAlignLeft">
          <Text>
            <Trans id="MNEMONIC_SUBTITLE" />
          </Text>
          <AssetSelector
            selectedAsset={assetToUse}
            showAssetIcon={false}
            showAssetName={true}
            searchable={true}
            assets={filteredAssets}
            onSelect={handleAssetUpdate}
          />
        </Box>
        <Box variant="columnAlignLeft" ml={isMobile ? SPACING.NONE : SPACING.SM}>
          <Text>
            <Trans id="MNEMONIC_DPATH_SELECT" />{' '}
            <LinkApp href="#" onClick={() => setDpathAddView(true)}>
              <Trans id="DETERMINISTIC_CUSTOM_LINK_TEXT" />
            </LinkApp>
            {'.'}
          </Text>
          <DPathSelector
            selectedDPath={selectedDPath}
            selectDPath={setSelectedDPath}
            dPaths={dpaths}
            clearable={false}
            searchable={false}
          />
        </Box>
      </SButtonContainer>
      <Box
        variant={isMobile ? 'columnAlign' : 'rowAlign'}
        justifyContent="space-between"
        pb={SPACING.SM}
        ml={!isMobile ? '-25px' : '0px'}
        mr={!isMobile ? '-25px' : '0px'}
      >
        <Switch
          id="address-toggle"
          checked={displayEmptyAddresses}
          onChange={handleToggleShowEmptyAddresses}
          labelLeft={translateRaw('HIDE_EMPTY_ADDRESSES')}
          labelRight={translateRaw('SHOW_EMPTY_ADDRESSES')}
        />
        <PoweredByText provider="FINDETH" />
      </Box>
      <TableContainer>
        {selectedAsset && (
          <HDWList
            isCompleted={isCompleted}
            asset={selectedAsset}
            scannedAccounts={scannedAccounts}
            network={network}
            selectedDPath={selectedDPath}
            displayEmptyAddresses={displayEmptyAddresses}
            onUnlock={onUnlock}
            onScanMoreAddresses={scanMoreAddresses}
            handleUpdate={updateAsset}
          />
        )}
      </TableContainer>
    </MnemonicWrapper>
  );
};

export default HDWallet;
