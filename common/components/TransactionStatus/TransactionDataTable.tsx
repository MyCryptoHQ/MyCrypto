import React from 'react';
import translate from 'translations';
import { Identicon, UnitDisplay, NewTabLink, Address, CodeBlock } from 'components/ui';
import { TransactionData, TransactionReceipt } from 'types/transactions';
import { NetworkConfig } from 'types/network';
import './TransactionDataTable.scss';

interface TableRow {
  label: React.ReactElement<string> | string;
  data: React.ReactElement<string> | string | number | null;
}

const MaybeLink: React.SFC<{
  href: string | null | undefined | false;
  children: any; // Too many damn React element types
}> = ({ href, children }) => {
  if (href) {
    return <NewTabLink href={href}>{children}</NewTabLink>;
  } else {
    return <React.Fragment>{children}</React.Fragment>;
  }
};

interface Props {
  data: TransactionData;
  receipt: TransactionReceipt | null;
  network: NetworkConfig;
}

const TransactionDataTable: React.SFC<Props> = ({ data, receipt, network }) => {
  const explorer: { [key: string]: string | false | null } = {};
  const hasInputData = data.input && data.input !== '0x';

  if (!network.isCustom) {
    explorer.tx = network.blockExplorer && network.blockExplorer.txUrl(data.hash);
    explorer.block =
      network.blockExplorer &&
      !!data.blockNumber &&
      network.blockExplorer.blockUrl(data.blockNumber);
    explorer.to = network.blockExplorer && network.blockExplorer.addressUrl(data.to);
    explorer.from = network.blockExplorer && network.blockExplorer.addressUrl(data.from);
    explorer.contract =
      network.blockExplorer &&
      receipt &&
      receipt.contractAddress &&
      network.blockExplorer.addressUrl(receipt.contractAddress);
  }

  let statusMsg = '';
  let statusType = '';
  let statusSeeMore = false;
  if (receipt) {
    if (receipt.status === 1) {
      statusMsg = 'SUCCESSFUL';
      statusType = 'success';
    } else if (receipt.status === 0) {
      statusMsg = 'FAILED';
      statusType = 'danger';
      statusSeeMore = true;
    } else {
      // Pre-byzantium transactions don't use status, and cannot have their
      // success determined over the JSON RPC api
      statusMsg = 'UNKNOWN';
      statusType = 'warning';
      statusSeeMore = true;
    }
  } else {
    statusMsg = 'PENDING';
    statusType = 'warning';
  }

  const rows: TableRow[] = [
    {
      label: translate('TX_STATUS'),
      data: (
        <React.Fragment>
          <strong className={`TxData-row-data-status is-${statusType}`}>{statusMsg}</strong>
          {statusSeeMore &&
            explorer.tx &&
            !network.isCustom && (
              <NewTabLink className="TxData-row-data-more" href={explorer.tx as string}>
                (See more on {network.blockExplorer.name})
              </NewTabLink>
            )}
        </React.Fragment>
      )
    },
    {
      label: translate('X_TXHASH'),
      data: <MaybeLink href={explorer.tx}>{data.hash}</MaybeLink>
    },
    {
      label: translate('TX_BLOCK_NUMB'),
      data: receipt && <MaybeLink href={explorer.block}>{receipt.blockNumber}</MaybeLink>
    },
    {
      label: translate('OFFLINE_STEP1_LABEL_1'),
      data: (
        <MaybeLink href={explorer.from}>
          <Identicon address={data.from} size="26px" />
          <Address address={data.from} />
        </MaybeLink>
      )
    },
    {
      label: translate('OFFLINE_STEP2_LABEL_1'),
      data: (
        <MaybeLink href={explorer.to}>
          <Identicon address={data.to} size="26px" />
          <Address address={data.to} />
        </MaybeLink>
      )
    },
    {
      label: translate('SEND_AMOUNT_SHORT'),
      data: <UnitDisplay value={data.value} unit="ether" symbol={network.unit} />
    },
    {
      label: translate('OFFLINE_STEP2_LABEL_3'),
      data: <UnitDisplay value={data.gasPrice} unit="gwei" symbol="Gwei" />
    },
    {
      label: translate('OFFLINE_STEP2_LABEL_4'),
      data: <UnitDisplay value={data.gas} unit="wei" />
    },
    {
      label: translate('TX_GAS_USED'),
      data: receipt && <UnitDisplay value={receipt.gasUsed} unit="wei" />
    },
    {
      label: translate('CONFIRM_TX_FEE'),
      data: receipt && (
        <UnitDisplay
          value={receipt.gasUsed.mul(data.gasPrice)}
          unit="ether"
          symbol={network.unit}
        />
      )
    },
    {
      label: translate('NEW_CONTRACT_ADDR'),
      data: receipt &&
        receipt.contractAddress && (
          <MaybeLink href={explorer.contract}>
            <Address address={receipt.contractAddress} />
          </MaybeLink>
        )
    },
    {
      label: translate('OFFLINE_STEP2_LABEL_5'),
      data: data.nonce
    },
    {
      label: translate('TRANS_DATA'),
      data: hasInputData ? <CodeBlock>{data.input}</CodeBlock> : null
    }
  ];

  const filteredRows = rows.filter(row => !!row.data);
  return (
    <table className="TxData table table-striped">
      <tbody>
        {filteredRows.map((row, idx) => (
          <tr className="TxData-row" key={idx}>
            <td className="TxData-row-label">{row.label}</td>
            <td className="TxData-row-data">{row.data}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionDataTable;
