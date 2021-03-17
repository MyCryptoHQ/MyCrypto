import React, { useState } from 'react';

import { Formik } from 'formik';
import { OptionProps } from 'react-select';
import styled from 'styled-components';
import { object, string } from 'yup';

import {
  AssetSelector,
  Box,
  Button,
  Input,
  LinkApp,
  PoweredByText,
  Selector,
  Switch,
  Text,
  Typography
} from '@components';
import { default as Icon } from '@components/Icon';
import { DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN } from '@config';
import { DeterministicWalletState, ExtendedDPath, isValidPath } from '@services';
import { BREAK_POINTS, COLORS, FONT_SIZE, monospace, SPACING } from '@theme';
import translate, { Trans, translateRaw } from '@translations';
import { DPath, ExtendedAsset, Network } from '@types';
import { accountsToCSV, filterValidAssets, sortByTicker, useScreenSize } from '@utils';

import { Downloader } from '../Downloader';
import DeterministicAccountList from './DeterministicAccountList';

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
  margin-bottom: ${SPACING.BASE};
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
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

const DropdownDPath = styled.span`
  padding-left: ${SPACING.XS};
  opacity: 0.5;
  font-size: 11px;
  font-family: ${monospace};
`;

const SContainer = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 12px;
`;

const SBox = styled(Box)`
  margin: ${SPACING.XS};
`;

export interface DeterministicWalletProps {
  state: DeterministicWalletState;
  assets: ExtendedAsset[];
  assetToUse: ExtendedAsset;
  network: Network;
  dpaths: DPath[];
  selectedDPath: DPath;
  setSelectedDPath(dpath: DPath): void;
  updateAsset(asset: ExtendedAsset): void;
  addDPaths(dpaths: ExtendedDPath[]): void;
  scanMoreAddresses?(dpath: ExtendedDPath): void;
  handleAssetUpdate(asset: ExtendedAsset): void;
  onUnlock(param: any): void;
}

interface FormValues {
  label: string;
  value: string;
}

const initialFormikValues: FormValues = {
  label: '',
  value: ''
};

type TDPathOptionProps = OptionProps<DPath> | { data: DPath; selectOption?(): void };
const DPathOption = ({ data, selectOption }: TDPathOptionProps) => (
  <SContainer onClick={selectOption && (() => selectOption(data))}>
    <Typography>
      {data.label}{' '}
      {data.value && <DropdownDPath>{data.value.toString().replace(' ', '')}</DropdownDPath>}
    </Typography>
  </SContainer>
);

const DeterministicWallet = ({
  state,
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
}: DeterministicWalletProps) => {
  const { isMobile } = useScreenSize();
  const [dpathAddView, setDpathAddView] = useState(false);
  const [displayEmptyAddresses, setDisplayEmptyAddresses] = useState(false);

  const handleDPathAddition = (values: FormValues) => {
    addDPaths([
      {
        ...values,
        offset: 0,
        numOfAddresses: DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN
      }
    ]);
    setDpathAddView(false);
  };

  const handleScanMoreAddresses = (dpath: ExtendedDPath) => {
    scanMoreAddresses!(dpath);
  };

  const csv = accountsToCSV(state.finishedAccounts, assetToUse);

  const Schema = object().shape({
    label: string().required(translateRaw('REQUIRED')),
    value: string()
      .required(translateRaw('REQUIRED'))
      .test('check-valid-path', translateRaw('DETERMINISTIC_INVALID_DPATH'), (value) =>
        isValidPath(value)
      )
  });
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
        onSubmit={(values) => handleDPathAddition(values)}
        validationSchema={Schema}
      >
        {({ errors, touched, handleChange, handleBlur, values, isSubmitting, handleSubmit }) => (
          <SForm onSubmit={handleSubmit}>
            <SLabel htmlFor="label">
              <Trans id="DETERMINISTIC_CUSTOM_LABEL" />
            </SLabel>
            <SInput
              placeholder="Custom Path"
              name="label"
              value={values.label}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={!errors.label}
              showInvalidWithoutValue={true}
            />
            <Error>{errors && touched.label && errors.label}</Error>
            <SLabel htmlFor="value">
              <Trans id="DETERMINISTIC_CUSTOM_LABEL_DPATH" />
            </SLabel>
            <SInput
              placeholder="m/44’/60’/0’/0’"
              name="value"
              value={values.value}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={!errors.value}
              showInvalidWithoutValue={true}
            />
            <Error>{errors && touched.value && errors.value}</Error>
            <SButton fullwidth={isMobile} disabled={isSubmitting} type="submit">
              <Trans id="DETERMINISTIC_ADD_DPATH" />
            </SButton>
          </SForm>
        )}
      </Formik>
      <Typography>
        <Trans id="DETERMINISTIC_SEE_SUMMARY" />{' '}
        <SDownloader data={csv} fileName="accounts.csv" mime="text/csv">
          <Trans id="DETERMINISTIC_ALTERNATIVES_5" />
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

      <Box pb={SPACING.MD} variant="spaceBetween">
        <SBox variant="columnAlignLeft">
          <Text>
            <Trans id="MNEMONIC_SUBTITLE" />
          </Text>
          <AssetSelector
            selectedAsset={assetToUse}
            showAssetIcon={false}
            showAssetName={true}
            searchable={true}
            assets={filteredAssets}
            onSelect={(option: ExtendedAsset) => {
              handleAssetUpdate(option);
            }}
          />
        </SBox>
        <SBox
          variant="columnAlignLeft"
          style={{ visibility: !displayEmptyAddresses ? 'hidden' : 'visible' }}
        >
          <Text>
            <Trans id="MNEMONIC_DPATH_SELECT" />{' '}
            <LinkApp href="#" onClick={() => setDpathAddView(true)}>
              <Trans id="DETERMINISTIC_CUSTOM_LINK_TEXT" />
            </LinkApp>
            {'.'}
          </Text>
          <Selector
            value={selectedDPath}
            onChange={setSelectedDPath}
            options={dpaths}
            optionComponent={DPathOption}
            valueComponent={({ value }) => <DPathOption data={value} />}
            clearable={false}
            searchable={false}
          />
        </SBox>
      </Box>
      <Box variant="rowAlign" justifyContent="space-between" pb={SPACING.SM}>
        <Switch
          checked={displayEmptyAddresses}
          onChange={() => setDisplayEmptyAddresses(!displayEmptyAddresses)}
          labelLeft={translateRaw('HIDE_EMPTY_ADDRESSES')}
          labelRight={translateRaw('SHOW_EMPTY_ADDRESSES')}
        />
        <PoweredByText provider="FINDETH" />
      </Box>
      <TableContainer>
        {state.asset && (
          <DeterministicAccountList
            isComplete={state.completed}
            asset={state.asset}
            finishedAccounts={state.finishedAccounts}
            network={network}
            selectedDPath={selectedDPath}
            displayEmptyAddresses={displayEmptyAddresses}
            onUnlock={onUnlock}
            handleScanMoreAddresses={handleScanMoreAddresses}
            handleUpdate={updateAsset}
          />
        )}
      </TableContainer>
    </MnemonicWrapper>
  );
};

export default DeterministicWallet;
