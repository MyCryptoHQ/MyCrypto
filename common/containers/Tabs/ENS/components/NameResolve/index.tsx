import React from 'react';
import { NewTabLink } from 'components/ui';
import { AppState } from 'reducers';
import { IResolveDomainRequest } from 'libs/ens';
const lookupLink = name => `https://etherscan.io/enslookup?q=${name}`;

type ChildrenProps = any;

const MonoTd = ({ children }: ChildrenProps) => (
  <td className="mono">{children}</td>
);

type Props = AppState['ens'];

const NameResolve = (props: Props) => {
  const { domainRequests, domainSelector } = props;

  const { currentDomain = null } = domainSelector;
  if (
    !currentDomain ||
    !domainRequests[currentDomain] ||
    typeof domainRequests[currentDomain].data === 'string'
  ) {
    return null;
  }

  const {
    deedAddress,
    registrationDate,
    value,
    highestBid,
    labelHash,
    nameHash,
    mappedMode,
    resolvedAddress,
    ownerAddress
  } = domainRequests[currentDomain].data as IResolveDomainRequest;

  return (
    <section>
      <h4>{mappedMode}</h4>
      <table className="table table-striped">
        <tbody>
          <tr>
            <td>Name: </td>
            <MonoTd>
              <NewTabLink
                content={`${currentDomain}.eth`}
                href={lookupLink(`${currentDomain}.eth`)}
              />
            </MonoTd>
          </tr>
          <tr>
            <td>Labelhash ({currentDomain}): </td>
            <MonoTd>{labelHash}</MonoTd>
          </tr>
          <tr>
            <td>Namehash ({currentDomain}).eth: </td>
            <MonoTd>{nameHash}</MonoTd>
          </tr>
          <tr>
            <td>Owner:</td>
            <MonoTd>{ownerAddress}</MonoTd>
          </tr>
          <tr>
            <td>Highest Bidder (Deed Owner): </td>
            <MonoTd>
              <span>{highestBid}</span>
            </MonoTd>
          </tr>
          <tr>
            <td>Resolved Address: </td>
            <MonoTd>{resolvedAddress}</MonoTd>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default NameResolve;
