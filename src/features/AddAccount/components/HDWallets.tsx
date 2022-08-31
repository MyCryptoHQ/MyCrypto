import { FormEvent, useEffect, useState } from 'react';

import { DeterministicWallet, DerivationPath as DPath } from '@mycrypto/wallets';
import styled from 'styled-components';

import questionSVG from '@assets/images/icn-question.svg';
import nextIcon from '@assets/images/next-page-button.svg';
import prevIcon from '@assets/images/previous-page-button.svg';
import { Account, Box, Button, Icon, InlineMessage, Input, LinkApp, Spinner } from '@components';
import { Table } from '@components/Table';
import { DEFAULT_NETWORK_TICKER, HELP_ARTICLE } from '@config';
import { getBaseAssetByNetwork, getLabelByAddressAndNetwork, isValidPath } from '@services';
import { useAssets, useContacts } from '@services/Store';
import { BalanceMap, getBaseAssetBalancesForAddresses } from '@services/Store/BalanceService';
import { HDWalletData } from '@services/WalletService';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { Network, TAddress, TTicker } from '@types';
import { bigify, buildAddressUrl, fromWei } from '@utils';

import { DPathSelector } from './DPathSelector';

const { GREY_LIGHTEST, BLUE_LIGHTEST, GREY_DARK } = COLORS;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  position: relative;
  width: 100%;
  margin-bottom: 35px;
  flex-wrap: wrap;

  > div {
    margin-top: ${SPACING.BASE};
  }

  @media (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    flex-direction: column;

    > :last-child {
      margin-top: ${SPACING.BASE};
    }
  }
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

const SDropdown = styled.div`
  width: 365px;
  margin-left: ${SPACING.SM};

  @media (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    width: 100%;
  }
`;

const CustomDPath = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${SPACING.SM};
`;

const InputGroup = styled.div`
  display: flex;
`;

const InputField = styled(Input)`
  margin-bottom: 0px;
  margin-right: 2px;
  max-width: 285px;

  @media (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    max-width: 100%;
  }
`;

const DWTable = styled(Table)<{ selected: number; page: number; disabled: boolean }>`
  ${({ disabled }) =>
    disabled &&
    `opacity: 0.5;
  pointer-events: none;`};

  tbody {
    tr {
      cursor: pointer;
      /* Highlight selected row */
      ${({ selected, page }) =>
        Math.trunc(selected / WALLETS_PER_PAGE) === page &&
        `:nth-child(${(selected % WALLETS_PER_PAGE) + 1}) {
            background: ${BLUE_LIGHTEST};
          };`};

      /* On hover don't highlight selected row */
      :not(:nth-child(${({ selected, page }) =>
              Math.trunc(selected / WALLETS_PER_PAGE) === page
                ? (selected % WALLETS_PER_PAGE) + 1
                : 0}))
        :hover {
        background-color: ${GREY_LIGHTEST};
      }
    }
  }
`;

const Bottom = styled.div`
  display: flex;
  margin-top: ${SPACING.BASE};
  margin-bottom: ${SPACING.BASE};
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    flex-direction: column;

    > :first-child {
      margin-bottom: ${SPACING.BASE};
    }
  }
`;

const Nav = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${GREY_DARK};
  font-size: ${FONT_SIZE.XS};
  width: 195px;
  ${({ disabled }) =>
    disabled &&
    `opacity: 0.5;
  pointer-events: none;`};

  > img {
    cursor: pointer;
  }
`;

const ButtonsGroup = styled.div`
  display: flex;
`;

const CancelButton = styled(Button)`
  margin-right: ${SPACING.BASE};
`;

const FooterLink = styled.div`
  text-align: center;
`;

const WALLETS_PER_PAGE = 5;

interface OwnProps {
  wallet: DeterministicWallet;
  network: Network | undefined;
  dPath: DPath;
  dPaths: DPath[];
}

interface DispatchProps {
  onCancel(): void;
  onConfirmAddress(address: string, addressIndex: number): void;
  onPathChange(dPath: DPath): void;
}

type Props = OwnProps & DispatchProps;

const customDPath: DPath = {
  name: translateRaw('X_CUSTOM'),
  path: ''
};

export function HDWalletsClass({
  wallet,
  network,
  dPath,
  dPaths,
  onCancel,
  onConfirmAddress,
  onPathChange
}: Props) {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [requestingBalanceCheck, setRequestingBalanceCheck] = useState(false);
  const [requestingWallets, setRequestingWallets] = useState(false);
  const [customPath, setCustomPath] = useState('');
  const [currentDPath, setCurrentDPath] = useState(dPath);
  const [page, setPage] = useState(0);
  const [wallets, setWallets] = useState([] as HDWalletData[]);
  const { contacts } = useContacts();
  const { assets } = useAssets();

  /* Used to update addresses displayed */
  useEffect(() => {
    getAddresses();
    return () => setRequestingBalanceCheck(true);
  }, [page, currentDPath]);

  /* Used to update balances for addresses displayed */
  useEffect(() => {
    if (!requestingBalanceCheck || requestingWallets) {
      return;
    }
    getBaseBalances();
    return;
  }, [requestingBalanceCheck]);

  const getAddresses = async () => {
    setRequestingWallets(true);
    if (dPath && isValidPath(dPath.path)) {
      try {
        const result = await wallet!.getAddresses({
          path: dPath,
          limit: WALLETS_PER_PAGE,
          offset: WALLETS_PER_PAGE * page
        });
        setWallets(result);
        setRequestingWallets(false);
        setRequestingBalanceCheck(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setRequestingWallets(false);
      setRequestingBalanceCheck(false);
    }
  };

  const getBaseBalances = () => {
    const addressesToLookup = wallets.map((wallet) => wallet.address);
    try {
      return getBaseAssetBalancesForAddresses(addressesToLookup, network).then(
        (balanceMapData: BalanceMap) => {
          const walletsWithBalances: HDWalletData[] = wallets.map((wallet) => {
            const balance = balanceMapData[wallet.address] || 0;
            return {
              ...wallet,
              value: balance
            };
          });
          setRequestingBalanceCheck(false);
          setWallets(walletsWithBalances);
        }
      );
    } catch (err) {
      console.error('getBaseBalance err ', err);
    }
  };

  const resetTable = () => {
    setPage(0);
    setSelectedAddressIndex(-1);
    setSelectedAddress('');
  };

  const handleChangePath = (newPath: DPath) => {
    resetTable();
    if (newPath.name === customDPath.name) {
      setCurrentDPath(newPath);
      setCustomPath('');
    } else {
      setCurrentDPath(newPath);
      onPathChange(newPath);
    }
  };

  const handleChangeCustomPath = (ev: FormEvent<HTMLInputElement>) =>
    setCustomPath(ev.currentTarget.value);

  const handleSubmitCustomPath = () => {
    resetTable();
    const submittedDPath: DPath = { ...customDPath, path: customPath };
    setCurrentDPath(submittedDPath);
    onPathChange(submittedDPath);
  };

  const handleConfirmAddress = () => onConfirmAddress(selectedAddress, selectedAddressIndex);

  const selectAddress = (selectedAddrIndex: number) => {
    setSelectedAddress(wallets[selectedAddrIndex].address);
    setSelectedAddressIndex(page * WALLETS_PER_PAGE + selectedAddrIndex);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(Math.max(page - 1, 0));
  };

  const renderWalletRow = (
    wallet: HDWalletData,
    // tslint:disable-next-line: no-shadowed-variable
    network: Network,
    // tslint:disable-next-line: no-shadowed-variable
    ticker: TTicker
  ) => {
    const addrBook = getLabelByAddressAndNetwork(wallet.address.toLowerCase(), contacts, network);

    return [
      <div key="wallet-row-0">{wallet.index + 1}</div>,
      <Account
        key="wallet-row-1"
        title={addrBook ? addrBook.label : translateRaw('NO_ADDRESS')}
        address={wallet.address}
        truncate={true}
      />,
      <div key="wallet-row-2">
        {!wallet.value ? (
          <Spinner />
        ) : (
          `${bigify(fromWei(wallet.value, 'ether')).toFixed(4)} ${ticker}`
        )}
      </div>,
      <Box key="wallet-row-3" display={'inline-flex'} alignItems={'center'}>
        <LinkApp
          href={buildAddressUrl(network.blockExplorer, wallet.address as TAddress)}
          isExternal={true}
        >
          <Icon type="link-out" width="1em" />
        </LinkApp>
      </Box>
    ];
  };

  let baseAssetTicker: TTicker | undefined;
  if (network) {
    baseAssetTicker = getBaseAssetByNetwork({ network, assets })!.ticker;
  }
  const ticker: TTicker = baseAssetTicker ? baseAssetTicker : DEFAULT_NETWORK_TICKER;
  const isCustom = currentDPath.name === customDPath.name;

  return (
    <>
      <Header>
        <Title>{translate('DECRYPT_PROMPT_SELECT_ADDRESS')}</Title>
        <SDropdown>
          <label>
            {translate('DPATH')}{' '}
            <LinkApp href={HELP_ARTICLE.DPATH} isExternal={true}>
              <img width="16px" src={questionSVG} />
            </LinkApp>
          </label>
          <DPathSelector
            selectedDPath={currentDPath}
            selectDPath={handleChangePath}
            dPaths={dPaths.concat([customDPath])}
            searchable={false}
          />
        </SDropdown>
      </Header>

      {isCustom && (
        <CustomDPath>
          <label>{translate('CUSTOM_DPATH')}</label>
          <InputGroup>
            <InputField
              value={customPath}
              placeholder="m/44'/60'/0'/0"
              onChange={handleChangeCustomPath}
              isValid={!!customPath && isValidPath(customPath)}
            />
            <button
              className="btn btn-success"
              disabled={!isValidPath(customPath)}
              onClick={handleSubmitCustomPath}
            >
              <i className="fa fa-check" />
            </button>
          </InputGroup>
          {customPath && !isValidPath(customPath) && (
            <InlineMessage>{translate('CUSTOM_DPATH_ERROR')}</InlineMessage>
          )}
        </CustomDPath>
      )}

      {requestingWallets && wallets.length === 0 ? (
        <Box variant="rowCenter">
          <Spinner size={2} />
        </Box>
      ) : (
        <DWTable
          disabled={isCustom && !currentDPath.name}
          selected={selectedAddressIndex}
          page={page}
          head={['#', translateRaw('ADDRESS'), ticker, translateRaw('ACTION_5')]}
          body={wallets.map((wallet) => renderWalletRow(wallet, network!, ticker))}
          config={{
            handleRowClicked: selectAddress
          }}
        />
      )}

      <Bottom>
        <Nav disabled={isCustom && !currentDPath.name}>
          <img src={prevIcon} onClick={prevPage} />
          {translate('PAGE_OF', { $page: (page + 1).toString(), $all: '∞' })}
          <img src={nextIcon} onClick={nextPage} />
        </Nav>
        <ButtonsGroup>
          <CancelButton onClick={onCancel} colorScheme={'inverted'}>
            {translate('CANCEL_ACTION')}
          </CancelButton>
          <Button onClick={handleConfirmAddress} disabled={!selectedAddress}>
            {translate('ACTION_6')}
          </Button>
        </ButtonsGroup>
      </Bottom>
      <FooterLink>{translate('FIND_ETH_LINK')}</FooterLink>
    </>
  );
}

export default HDWalletsClass;
