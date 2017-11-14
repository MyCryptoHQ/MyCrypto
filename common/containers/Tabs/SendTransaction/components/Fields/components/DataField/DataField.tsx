import { DataInput } from './DataInput';
import { isValidHex } from 'libs/validators';
import { Query } from 'components/renderCbs';
import { Data } from 'libs/units';
import React from 'react';

interface Props {
  data: string | null;
  onChange(data: Buffer | null): void;
}

interface State {
  validData: boolean;
  data: string;
}

class DataField extends React.Component<Props, State> {
  public componentDidMount() {
    const { data, onChange } = this.props;
    if (data) {
      onChange(Data(data));
      this.setState({ data, validData: true });
    } else {
      onChange(Data('')); // default data is empty buffer
      this.setState({ data: '', validData: false });
    }
  }

  public render() {
    return (
      <DataInput
        onChange={this.setData}
        value={this.state.data}
        validData={this.state.validData}
      />
    );
  }

  private setData = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    const validData = isValidHex(value);
    this.props.onChange(validData ? Data(value) : null);
    this.setState({ data: value, validData });
  };
}

interface DefaultProps {
  unit: string;
  withData(data: Buffer | null);
}

const DefaultDataField: React.SFC<DefaultProps> = (
  /* TODO: check query param of tokens too */
  { withData, unit } // only display if it isn't a token
) =>
  unit === 'ether' ? (
    <Query
      params={['data']}
      withQuery={({ data }) => <DataField onChange={withData} data={data} />}
    />
  ) : null;

export { DefaultDataField as DataField };
