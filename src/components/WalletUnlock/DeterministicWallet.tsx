import React, { useState } from 'react';

import { Formik } from 'formik';
import styled from 'styled-components';
import { object, string } from 'yup';

import { AssetSelector, Button, Input, Typography } from '@components';
import Icon from '@components/Icon';
import { DEFAULT_GAP_TO_SCAN_FOR, DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN } from '@config';
import { DeterministicWalletState, ExtendedDPath, isValidPath } from '@services';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
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

const Parameters = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${SPACING.LG};
  margin-top: ${SPACING.SM};
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    flex-direction: column;
    & > div:first-child {
      margin-bottom: ${SPACING.BASE};
    }
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

interface DeterministicWalletProps {
  state: DeterministicWalletState;
  defaultDPath: DPath;
  assets: ExtendedAsset[];
  assetToUse: ExtendedAsset;
  network: Network;
  updateAsset(asset: ExtendedAsset): void;
  addDPaths(dpaths: ExtendedDPath[]): void;
  generateFreshAddress(defaultDPath: ExtendedDPath): boolean;
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

const DeterministicWallet = ({
  state,
  defaultDPath,
  assets,
  assetToUse,
  network,
  updateAsset,
  addDPaths,
  generateFreshAddress,
  handleAssetUpdate,
  onUnlock
}: DeterministicWalletProps) => {
  const { isMobile } = useScreenSize();

  const [dpathAddView, setDpathAddView] = useState(false);
  const [freshAddressIndex, setFreshAddressIndex] = useState(0);

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

  const handleFreshAddressGeneration = () => {
    if (freshAddressIndex >= DEFAULT_GAP_TO_SCAN_FOR || !state.completed) {
      return;
    }
    const freshAddressGenerationSuccess = generateFreshAddress({
      ...defaultDPath,
      offset: freshAddressIndex,
      numOfAddresses: 1
    });
    if (freshAddressGenerationSuccess) {
      setFreshAddressIndex(freshAddressIndex + 1);
    }
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
      <Typography>
        <Trans id="MNEMONIC_SUBTITLE" />
      </Typography>
      <Parameters>
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
        <Button onClick={() => setDpathAddView(true)} colorScheme={'inverted'}>
          <Trans id="MNEMONIC_ADD_CUSTOM_DPATH" />
        </Button>
      </Parameters>
      <TableContainer>
        {state.asset && (
          <DeterministicAccountList
            isComplete={state.completed}
            asset={state.asset}
            finishedAccounts={state.finishedAccounts}
            onUnlock={onUnlock}
            network={network}
            generateFreshAddress={handleFreshAddressGeneration}
            handleUpdate={updateAsset}
            freshAddressIndex={freshAddressIndex}
          />
        )}
      </TableContainer>
    </MnemonicWrapper>
  );
};

export default DeterministicWallet;
