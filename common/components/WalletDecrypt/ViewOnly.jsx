import React from 'react';
import translate from 'translations';
import PropTypes from 'prop-types';

const ViewOnlyDecrypt = ({ value, onChange, onUnlock }) => {
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
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={translate('x_Address')}
            rows="2"
          />
        </div>
      </div>
    </section>
  );
};

ViewOnlyDecrypt.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUnlock: PropTypes.func.isRequired
};

export default ViewOnlyDecrypt;
