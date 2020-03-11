import React from 'react';
import { OptionComponentProps } from 'react-select';

import { Divider } from 'v2/components';

class ZapOption extends React.PureComponent<OptionComponentProps> {
  public render() {
    const { option, onSelect } = this.props;
    return (
      <>
        <ZapSummary
          name={option.name}
          keyId={option.key}
          onClick={() => onSelect!(option, null)} // Since it's a custom Dropdown we know onSelect is defined
        />
        <Divider padding={'14px'} />
      </>
    );
  }
}

/* ToDo: React Select doesn't seem to like these memoized components as optionComponents, figure out a solution to this. */
/*const MemoizedZapOption = React.memo(ZapOption);
export default MemoizedZapOption;*/

export const ZapSummary = ({
  name,
  keyId,
  onClick
}: {
  name: string;
  keyId: string;
  onClick: any;
}) => {
  return (
    <div onClick={onClick}>
      <p>{name && keyId ? `${name} - ${keyId}` : 'unknown'}</p>
    </div>
  );
};

export default ZapOption;
