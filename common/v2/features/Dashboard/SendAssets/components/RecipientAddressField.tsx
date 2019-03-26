import React from "react";
import { AddressField } from "components";
import { connect } from "react-redux";
import { AppState } from "features/reducers";
import { configSelectors } from "features/config";
//import { donationAddressMap } from '';

interface OwnProps {
  isReadOnly?: boolean;
  isSelfAddress?: boolean;
  isCheckSummed?: boolean;
  showLabelMatch?: boolean;
  showIdenticon?: boolean;
  showInputLabel?: boolean;
  showEnsResolution?: boolean;
  placeholder?: string;
  value?: string;
  dropdownThreshold?: number;
  //toChecksumAddress: ReturnType<typeof configSelectors.getChecksumAddressFn>;
}

interface StateProps {
  name: string;
}

type Props = OwnProps & StateProps;

export default function RecipientAddressField ({ showLabelMatch}: Props ) {
  return (
  <AddressField
    showLabelMatch={showLabelMatch}
  />
)};
/*
export default connect((state: AppState): StateProps => ({
  name: 'meh'
}))(RecipientAddressField);*/
//export default connect((state: AppState) => ((RecipientAddressField)));