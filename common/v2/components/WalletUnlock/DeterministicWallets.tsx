import React, { useState, useEffect, useContext } from 'react';
import Select, { Option } from 'react-select';
import { Table, Address, Button } from '@mycrypto/ui';
import BN from 'bn.js';

import translate, { translateRaw } from 'translations';
import { Input, Spinner } from 'v2/components';

import { truncate } from 'v2/utils';
import { Network } from 'v2/types';
import {
  getBaseAssetSymbolByNetwork,
  AddressBookContext,
  getLabelByAddressAndNetwork,
  isValidPath,
  fromWei
} from 'v2/services';
import nextIcon from 'assets/images/next-page-button.svg';
import prevIcon from 'assets/images/previous-page-button.svg';
import radio from 'assets/images/radio.svg';
import radioChecked from 'assets/images/radio-checked.svg';

import './DeterministicWallets.scss';
import { DeterministicWalletData, getDeterministicWallets } from 'v2/services/WalletService';
import { getBaseAssetBalances, BalanceMap } from 'v2/services/Store/BalanceService';

function Radio({ checked }: { checked: boolean }) {
  return <img className="clickable radio-image" src={checked ? radioChecked : radio} />;
}

const WALLETS_PER_PAGE = 5;

interface OwnProps {
  network: Network | undefined;
  dPath: DPath;
  dPaths: DPath[];
  publicKey?: string;
  chainCode?: string;
  seed?: string;
}

interface DispatchProps {
  onCancel(): void;
  onConfirmAddress(address: string, addressIndex: number): void;
  onPathChange(dPath: DPath): void;
}

type Props = OwnProps & DispatchProps;

const customDPath: DPath = {
  label: 'custom',
  value: 'custom'
};
export function DeterministicWalletsClass({
  network,
  dPath,
  dPaths,
  publicKey,
  chainCode,
  seed,
  onCancel,
  onConfirmAddress,
  onPathChange
}: Props) {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [reqestingBalanceCheck, setReqestingBalanceCheck] = useState(false);
  const [requestingWallets, setRequestingWallets] = useState(false);
  const [customPath, setCustomPath] = useState('');
  const [currentDPath, setCurrentDPath] = useState(dPath);
  const [page, setPage] = useState(0);
  const [wallets, setWallets] = useState([] as DeterministicWalletData[]);
  const { addressBook } = useContext(AddressBookContext);

  /* Used to update addresses displayed */
  useEffect(() => {
    getAddresses({
      network,
      dPath: currentDPath,
      dPaths,
      publicKey,
      chainCode,
      seed
    });
    return () => setReqestingBalanceCheck(true);
  }, [page, currentDPath]);

  /* Used to update balances for addresses displayed */
  useEffect(() => {
    if (!reqestingBalanceCheck || requestingWallets) {
      return;
    }
    getBaseBalances();
    return;
  }, [reqestingBalanceCheck]);

  const getAddresses = (props: OwnProps) => {
    setRequestingWallets(true);
    // tslint:disable-next-line: no-shadowed-variable
    const { dPath, publicKey, chainCode, seed } = props;
    if (dPath && ((publicKey && chainCode) || seed)) {
      if (isValidPath(dPath.value)) {
        setWallets(
          getDeterministicWallets({
            seed,
            dPath: dPath.value,
            publicKey,
            chainCode,
            limit: WALLETS_PER_PAGE,
            offset: WALLETS_PER_PAGE * page
          })
        );
        setRequestingWallets(false);
        setReqestingBalanceCheck(true);
        return;
      } else {
        console.error('Invalid dPath provided', dPath);
        setRequestingWallets(false);
        setReqestingBalanceCheck(true);
        return;
      }
    }
  };

  const getBaseBalances = () => {
    const addressesToLookup = wallets.map(wallet => wallet.address);
    try {
      return getBaseAssetBalances(addressesToLookup, network).then((balanceMapData: BalanceMap) => {
        const walletsWithBalances: DeterministicWalletData[] = wallets.map(wallet => {
          const balance = balanceMapData[wallet.address];
          const value = new BN(balance.toString(10));
          return {
            ...wallet,
            value
          };
        });
        setReqestingBalanceCheck(false);
        setWallets(walletsWithBalances);
      });
    } catch (err) {
      console.error('getBaseBalance err ', err);
    }
  };

  const handleChangePath = (newPath: DPath) => {
    if (newPath.value === customDPath.value) {
      setCurrentDPath(newPath);
    } else {
      setCurrentDPath(newPath);
      onPathChange(newPath);
    }
  };

  const handleChangeCustomPath = (ev: React.FormEvent<HTMLInputElement>) => {
    setCustomPath(ev.currentTarget.value);
  };

  const handleSubmitCustomPath = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (currentDPath.value === customDPath.value && isValidPath(customPath)) {
      onPathChange({
        label: customDPath.label,
        value: customPath
      });
    }
  };

  const handleConfirmAddress = () => {
    if (selectedAddress) {
      onConfirmAddress(selectedAddress, selectedAddressIndex);
    }
  };

  const selectAddress = (selectedAddr: string, selectedAddrIndex: number) => {
    setSelectedAddress(selectedAddr);
    setSelectedAddressIndex(selectedAddrIndex);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(Math.max(page - 1, 0));
  };

  const renderDPathOption = (option: Option) => {
    if (option.value === customDPath.value) {
      return translate('X_CUSTOM');
    }

    return (
      <React.Fragment>
        {option.label} {option.value && <small>({option.value.toString().replace(' ', '')})</small>}
      </React.Fragment>
    );
  };

  const renderWalletRow = (
    wallet: DeterministicWalletData,
    // tslint:disable-next-line: no-shadowed-variable
    network: Network | undefined,
    // tslint:disable-next-line: no-shadowed-variable
    symbol: string
  ) => {
    const addrBook = getLabelByAddressAndNetwork(
      wallet.address.toLowerCase(),
      addressBook,
      network
    );
    let blockExplorer;
    if (network && !network.isCustom && network.blockExplorer) {
      blockExplorer = network.blockExplorer;
    } else {
      blockExplorer = {
        addressUrl: (address: string) => {
          return `https://ethplorer.io/address/${address}`;
        }
      };
    }

    // tslint:disable:jsx-key
    return [
      <div className="DW-addresses-table-address-select">
        {wallet.index + 1}
        <Radio checked={selectedAddress === wallet.address} />
      </div>,
      <Address
        title={addrBook ? addrBook.label : 'Unknown Address'}
        address={wallet.address}
        truncate={truncate}
      />,
      <div>
        {!wallet.value ? (
          <Spinner />
        ) : (
          `${parseFloat(fromWei(wallet.value, 'ether')).toFixed(4)} ${symbol}`
        )}
      </div>,
      <a
        target="_blank"
        href={blockExplorer.addressUrl(wallet.address)}
        rel="noopener noreferrer"
        onClick={event => event.stopPropagation()}
      >
        <i className="DW-addresses-table-more" />
      </a>
    ].map(element => (
      <div className="clickable" onClick={() => selectAddress(wallet.address, wallet.index)}>
        {element}
      </div>
    ));
    // tslint:enable:jsx-key
  };

  /*public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { publicKey, chainCode, seed, dPath } = this.props;
    if (
      nextProps.publicKey !== publicKey ||
      nextProps.chainCode !== chainCode ||
      nextProps.dPath !== dPath ||
      nextProps.seed !== seed
    ) {
      this.getAddresses(nextProps);
    }
  }*/

  let baseAssetSymbol: string | undefined;
  if (network) {
    baseAssetSymbol = getBaseAssetSymbolByNetwork(network);
  }
  const symbol: string = baseAssetSymbol ? baseAssetSymbol : 'ETH';

  return (
    <div className="DW">
      <form className="DW-path form-group-sm" onSubmit={handleSubmitCustomPath}>
        <div className="DW-header">
          {' '}
          <div className="DW-header-title">{translate('DECRYPT_PROMPT_SELECT_ADDRESS')}</div>
          <div className="DW-header-select">
            <Select
              name="fieldDPath"
              value={currentDPath}
              onChange={handleChangePath}
              options={dPaths.concat([customDPath])}
              optionRenderer={renderDPathOption}
              valueRenderer={renderDPathOption}
              clearable={false}
              searchable={false}
            />
          </div>
        </div>

        {currentDPath.label === customDPath.label && (
          <div className="flex-wrapper">
            <div className="DW-custom">
              <Input
                isValid={customPath ? isValidPath(customPath) : true}
                value={customPath}
                placeholder="m/44'/60'/0'/0"
                onChange={handleChangeCustomPath}
              />
            </div>
            <button className="DW-path-submit btn btn-success" disabled={!isValidPath(customPath)}>
              <i className="fa fa-check" />
            </button>
          </div>
        )}
      </form>

      <Table
        head={['#', 'Address', symbol, translateRaw('ACTION_5')]}
        body={wallets.map(wallet => renderWalletRow(wallet, network, symbol))}
        config={{ hiddenHeadings: ['#', translateRaw('ACTION_5')] }}
      />

      <div className="DW-addresses-nav">
        <img src={prevIcon} onClick={prevPage} />
        <span className="DW-addresses-nav-page">PAGE {page + 1} OF ∞</span>
        <img className="Identicon-img" src={nextIcon} onClick={nextPage} />

        <Button onClick={onCancel} secondary={true}>
          {translate('ACTION_2')}
        </Button>
        <Button onClick={handleConfirmAddress} disabled={!selectedAddress}>
          {translate('ACTION_6')}
        </Button>
      </div>
    </div>
  );
}

export default DeterministicWalletsClass;
