import React from 'react';
import translate from 'translations';
import { Identicon, UnitDisplay, NewTabLink } from 'components/ui';
import { TransactionData, TransactionReceipt } from 'libs/nodes';
import { NetworkConfig } from 'config';
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
  const txUrl = network.blockExplorer && network.blockExplorer.txUrl(data.hash);
  const blockUrl =
    network.blockExplorer && !!data.blockNumber && network.blockExplorer.blockUrl(data.blockNumber);
  const toUrl = network.blockExplorer && network.blockExplorer.addressUrl(data.to);
  const fromUrl = network.blockExplorer && network.blockExplorer.addressUrl(data.from);
  const contractUrl =
    network.blockExplorer &&
    receipt &&
    receipt.contractAddress &&
    network.blockExplorer.addressUrl(receipt.contractAddress);
  const hasInputData = data.input && data.input !== '0x';

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
      label: 'Status',
      data: (
        <React.Fragment>
          <strong className={`TxData-row-data-status is-${statusType}`}>{statusMsg}</strong>
          {statusSeeMore &&
            txUrl &&
            network.blockExplorer && (
              <NewTabLink className="TxData-row-data-more" href={txUrl}>
                (See more on {network.blockExplorer.name})
              </NewTabLink>
            )}
        </React.Fragment>
      )
    },
    {
      label: translate('x_TxHash'),
      data: <MaybeLink href={txUrl}>{data.hash}</MaybeLink>
    },
    {
      label: 'Block Number',
      data: receipt && <MaybeLink href={blockUrl}>{receipt.blockNumber}</MaybeLink>
    },
    {
      label: translate('OFFLINE_Step1_Label_1'),
      data: (
        <MaybeLink href={fromUrl}>
          <Identicon address={data.from} size="26px" />
          {data.from}
        </MaybeLink>
      )
    },
    {
      label: translate('OFFLINE_Step2_Label_1'),
      data: (
        <MaybeLink href={toUrl}>
          <Identicon address={data.to} size="26px" />
          {data.to}
        </MaybeLink>
      )
    },
    {
      label: translate('SEND_amount_short'),
      data: <UnitDisplay value={data.value} unit="ether" symbol={network.unit} />
    },
    {
      label: translate('OFFLINE_Step2_Label_3'),
      data: <UnitDisplay value={data.gasPrice} unit="gwei" symbol="Gwei" />
    },
    {
      label: translate('OFFLINE_Step2_Label_4'),
      data: <UnitDisplay value={data.gas} unit="wei" />
    },
    {
      label: 'Gas Used',
      data: receipt && <UnitDisplay value={receipt.gasUsed} unit="wei" />
    },
    {
      label: 'Transaction Fee',
      data: receipt && (
        <UnitDisplay
          value={receipt.gasUsed.mul(data.gasPrice)}
          unit="ether"
          symbol={network.unit}
        />
      )
    },
    {
      label: translate('New contract address'),
      data: receipt &&
        receipt.contractAddress && (
          <MaybeLink href={contractUrl}>{receipt.contractAddress}</MaybeLink>
        )
    },
    {
      label: translate('OFFLINE_Step2_Label_5'),
      data: data.nonce
    },
    {
      label: translate('TRANS_data'),
      data: hasInputData ? (
        <textarea className="form-control" value={data.input} disabled={true} />
      ) : null
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
