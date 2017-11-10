import React from 'react';
import Dropdown from 'components/ui/Dropdown';
import { withConditional } from 'components/hocs';

interface Props {
  value: string;
  options: string[];
  isReadOnly: boolean;
  onChange(value: string): void;
}

export const ConditionalUnitDropdown: React.SFC<Props> = props => {
  const { value, options, onChange, isReadOnly } = props;
  const StringDropdown = Dropdown as new () => Dropdown<string>;
  const ConditionalStringDropDown = withConditional(StringDropdown);

  return (
    <div className="input-group-btn">
      <ConditionalStringDropDown
        options={options}
        value={value}
        condition={isReadOnly}
        conditionalProps={{ onChange }}
        ariaLabel={'dropdown'}
      />
    </div>
  );
};
