// @flow
import React from 'react';
import translate from 'translations';

export type AddressValue = {
  address: string
};

export type ViewOnlyProps = {
  value: AddressValue,
  onChange: (value: AddressValue) => void,
  onUnlock: () => void
};

const ViewOnlyDecrypt = ({ value, onChange, onUnlock }: ViewOnlyProps) => {
  const { address } = value;

  const onAddressChange = (e: SyntheticInputEvent) => {
    // need to validate here
    onChange({
      ...value,
      address: e.target.value
    });
  };

  const onKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      onUnlock();
    }
  };

  return (
    <section className="col-md-4 col-sm-6">
      <div id="selectedTypeKey">
        <h4>
          {translate('ADD_Label_5')}
        </h4>
        <div className="form-group">
          <textarea
            id="address-label"
            className="form-control"
            value={address}
            onChange={onAddressChange}
            onKeyDown={onKeyDown}
            placeholder={translate('x_Address')}
            rows="2"
          />
        </div>
      </div>
    </section>
  );
};

export default ViewOnlyDecrypt;
