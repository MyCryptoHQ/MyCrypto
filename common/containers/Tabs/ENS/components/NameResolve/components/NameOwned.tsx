import React from 'react';
import { IOwnedDomainRequest } from 'libs/ens';
import { fromWei, Wei } from 'libs/units';
import { NewTabLink, Address } from 'components/ui';
import translate from 'translations';
const lookupLink = (name: string) => `https://etherscan.io/enslookup?q=${name}`;

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
      <h1 className="text-center">{translate('ENS_DOMAIN_OWNED', { $name: name + '.eth' })}</h1>
    </div>
    <div className="ens-table-wrapper">
      <table className="table table-striped">
        <tbody>
          <tr>
            <td>{translate('NAME_OWNED_NAME')}:</td>
            <MonoTd>
              <NewTabLink content={`${name}.eth`} href={lookupLink(`${name}.eth`)} />
            </MonoTd>
          </tr>
          <tr>
            <td>{translate('NAME_OWNED_LABELHASH', { name })}:</td>
            <MonoTd>{labelHash}</MonoTd>
          </tr>
          <tr>
            <td>{translate('NAME_OWNED_NAMEHASH', { name })}: </td>
            <MonoTd>{nameHash}</MonoTd>
          </tr>
          <tr>
            <td>{translate('NAME_OWNED_OWNER')}:</td>
            <MonoTd>
              <Address address={ownerAddress} />
            </MonoTd>
          </tr>
          <tr>
            <td>{translate('NAME_OWNED_HIGHEST_BID')}:</td>
            <MonoTd>
              <span>{fromWei(Wei(highestBid), 'ether')} ETH</span>
            </MonoTd>
          </tr>
          <tr>
            <td>{translate('NAME_OWNED_RESOLVED_ADDR')}:</td>
            <MonoTd>
              <Address address={resolvedAddress} />
            </MonoTd>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);
