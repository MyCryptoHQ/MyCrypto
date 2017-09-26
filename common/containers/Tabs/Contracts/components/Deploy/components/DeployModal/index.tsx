import React from 'react';
import translate from 'translations';
const ModalDialogContent = ({ children }) => (
  <article className="modal fade" id="deployContract" tabIndex={-1}>
    <section className="modal-dialog">
      <section className="modal-content"> {children} </section>
    </section>
  </article>
);
const DeployModal = props => {
  //const {network, service}= props
  return (
    <ModalDialogContent>
      <div className="modal-body">
        <button type="button" className="close" data-dismiss="modal">
          &times;
        </button>

        <h2 className="modal-title text-danger">
          {translate('SENDModal_Title')}
        </h2>

        <p>
          You are about to <strong>deploy a contract</strong> on the{' '}
          <strong>{'PLACEHOLDER'}</strong> chain.
        </p>

        <p>
          The <strong>{'PLACEHOLDER'}</strong> node you are sending through is
          provided by <strong>{'PLACEHOLDER'}</strong>.
        </p>

        <h4>{translate('SENDModal_Content_3')}</h4>
      </div>

      <div className="modal-footer">
        <button className="btn btn-default" data-dismiss="modal">
          {translate('SENDModal_No')}
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {translate('SENDModal_Yes')}
        </button>
      </div>
    </ModalDialogContent>
  );
};
