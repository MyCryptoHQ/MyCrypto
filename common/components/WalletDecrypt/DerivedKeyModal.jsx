import React from 'react';
import Modal from 'components/ui/Modal';

type Props = {
  isOpen: ?boolean,
  publicKey: string,
  chainCode: string,
  dPath: string
};

export default class DerivedKeyModal extends React.Component {
  props: Props;

  render() {
    return <Modal title="Choose an Address" isOpen={this.props.isOpen} />;
  }
}
