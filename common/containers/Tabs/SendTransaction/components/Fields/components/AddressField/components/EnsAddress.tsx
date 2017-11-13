import React from 'react';
/*

  public onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const newValue = (e.target as HTMLInputElement).value;
    const { onChange } = this.props;
    if (!onChange) {
      return;
    }
    // FIXME debounce?
    if (isValidENSAddress(newValue)) {
      this.props.resolveEnsName(newValue);
    }
    onChange(newValue);
  };
}
function mapStateToProps(state: AppState, props: PublicProps) {
  return {
    ensAddress: getEnsAddress(state, props.value)
  };
}
export default connect(mapStateToProps, { resolveEnsName })(AddressField);
*/

interface EnsAddressProps {
  ensAddress: string | null;
}

export const EnsAddress: React.SFC<EnsAddressProps> = ({ ensAddress }) =>
  (!!ensAddress && (
    <p className="ens-response">
      ↳
      <span className="mono">{ensAddress}</span>
    </p>
  )) ||
  null;
