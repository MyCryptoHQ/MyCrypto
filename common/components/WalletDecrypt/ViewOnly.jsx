import React from 'react';
import translate from 'translations';
import PropTypes from 'prop-types';

const ViewOnlyDecrypt = ({ value, onChange, onUnlock }) =>
  <section className="col-md-4 col-sm-6">
    <div id="selectedUploadKey">
      <h4>
        {translate('ADD_Radio_2_alt')}
      </h4>

      <div className="form-group">
        <input type="file" id="fselector" />

        <a className="btn-file marg-v-sm" id="aria1" tabIndex="0" role="button">
          {translate('ADD_Radio_2_short')}
        </a>
      </div>
    </div>
  </section>;

ViewOnlyDecrypt.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onUnlock: PropTypes.func.isRequired
};

export default ViewOnlyDecrypt;
