import React, {Component} from 'react';
import translate from 'translations';


export default class PrivateKeyDecrypt extends Component {
    render() {
        return (
            <section className="col-md-4 col-sm-6">
                <div id="selectedUploadKey">
                    <h4>{translate('ADD_Radio_2_alt')}</h4>

                    <div className="form-group">
                        <input type="file" id="fselector" />

                        <a className="btn-file marg-v-sm" id="aria1" tabIndex="0" role="button">{translate('ADD_Radio_2_short')}</a>
                    </div>
                </div>
            </section>
        );
    }
}