import React, { useState } from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';

import { Typography, Button, AssetSelector, Input } from '@components';
import { COLORS, BREAK_POINTS, SPACING } from '@theme';

import Icon from '@components/Icon';
import translate, { Trans } from '@translations';
import { DEFAULT_GAP_TO_SCAN_FOR, DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN } from '@config';
import { accountsToCSV } from '@utils';
import { ExtendedAsset, Network } from '@types';
import DeterministicAccountList from './DeterministicAccountList';
import { DeterministicWalletState, ExtendedDPath } from '@services';

const MnemonicWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled(Typography)`
  color: ${COLORS.BLUE_DARK};
  margin-bottom: 20px;
`;

const Parameters = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 40px;
  margin-top: 15px;
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
`;

const SForm = styled.form`
  width: 50%;
`;

const SLabel = styled.label`
  font-weight: normal;
  margin-bottom: ${SPACING.SM};
  margin-top: ${SPACING.MD};
`;

const SButton = styled(Button)`
  margin: 30px 0;
`;

const SLink = styled.span`
  color: ${COLORS.BLUE_MYC};
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: ${COLORS.BLUE_LIGHT_DARKISH};
  }
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
    if (freshAddressIndex > DEFAULT_GAP_TO_SCAN_FOR || !state.completed) {
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

  const handleDownload = () => window.open(accountsToCSV(state.finishedAccounts, assetToUse));

  return dpathAddView ? (
    <MnemonicWrapper>
      <HeadingWrapper>
        <Icon type="back" width={20} onClick={() => setDpathAddView(false)} />
        <Title fontSize="32px" bold={true}>
          <Trans id="DETERMINISTIC_CUSTOM_TITLE" />
        </Title>
      </HeadingWrapper>
      <Typography>{translate('DETERMINISTIC_CUSTOM_GET_INFORMED')}</Typography>
      <Formik initialValues={initialFormikValues} onSubmit={handleDPathAddition}>
        {({ handleChange, values }) => (
          <SForm>
            <SLabel htmlFor="label">
              <Trans id="DETERMINISTIC_CUSTOM_LABEL" />
            </SLabel>
            <Input
              placeholder="Custom Path"
              name="label"
              value={values.label}
              onChange={handleChange}
            />
            <SLabel htmlFor="value">
              <Trans id="DETERMINISTIC_CUSTOM_LABEL_DPATH" />
            </SLabel>
            <Input
              placeholder="m/44’/60’/0’/0’"
              name="value"
              value={values.value}
              onChange={handleChange}
            />
            <SButton onClick={() => handleDPathAddition(values)}>
              <Trans id="DETERMINISTIC_ADD_DPATH" />
            </SButton>
          </SForm>
        )}
      </Formik>
      <Typography>
        <Trans id="DETERMINISTIC_SEE_SUMMARY" />{' '}
        <SLink onClick={handleDownload}>
          <Trans id="DETERMINISTIC_ALTERNATIVES_5" />
        </SLink>
        .
      </Typography>
    </MnemonicWrapper>
  ) : (
    <MnemonicWrapper>
      <Title fontSize="32px" bold={true}>
        <Trans id="MNEMONIC_TITLE" />
      </Title>
      <Typography>
        <Trans id="MNEMONIC_SUBTITLE" />
      </Typography>
      <Parameters>
        <AssetSelector
          selectedAsset={assetToUse}
          assets={assets}
          onSelect={(option: ExtendedAsset) => {
            handleAssetUpdate(option);
          }}
        />
        <Button onClick={() => setDpathAddView(true)} inverted={true}>
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
          />
        )}
      </TableContainer>
    </MnemonicWrapper>
  );
};

export default DeterministicWallet;
