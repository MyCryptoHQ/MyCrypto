import React from 'react';
import { IOwnedDomainRequest } from 'libs/ens';
import { NewTabLink, Address } from 'components/ui';
const lookupLink = name => `https://etherscan.io/enslookup?q=${name}`;

type ChildrenProps = any;

const MonoTd = ({ children }: ChildrenProps) => <td className="mono">{children}</td>;

export const NameOwned: React.SFC<IOwnedDomainRequest> = ({
  highestBid,
  labelHash,
  nameHash,
  resolvedAddress,
  ownerAddress,
  name
}) => (
  <section>
    <div className="ens-title">
      <h1 className="text-center">
        <strong>{name}.eth</strong> is already owned
      </h1>
    </div>
    <div className="ens-table-wrapper">
      <table className="table table-striped">
        <tbody>
          <tr>
            <td>Name: </td>
            <MonoTd>
              <NewTabLink content={`${name}.eth`} href={lookupLink(`${name}.eth`)} />
            </MonoTd>
          </tr>
          <tr>
            <td>Labelhash ({name}): </td>
            <MonoTd>{labelHash}</MonoTd>
          </tr>
          <tr>
            <td>Namehash ({name}.eth): </td>
            <MonoTd>{nameHash}</MonoTd>
          </tr>
          <tr>
            <td>Owner:</td>
            <MonoTd>
              <Address address={ownerAddress} />
            </MonoTd>
          </tr>
          <tr>
            <td>Highest Bidder (Deed Owner): </td>
            <MonoTd>
              <span>{highestBid}</span>
            </MonoTd>
          </tr>
          <tr>
            <td>Resolved Address: </td>
            <MonoTd>
              <Address address={resolvedAddress} />
            </MonoTd>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);
