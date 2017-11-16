import { DataInput } from './DataInput';
import { isValidHex } from 'libs/validators';
import { Query, SetTransactionField } from 'components/renderCbs';
import { SetDataFieldAction } from 'actions/transaction';
import { Data } from 'libs/units';
import React from 'react';

interface Props {
  data: string | null;
  setter(payload: SetDataFieldAction['payload']): void;
}

class DataField extends React.Component<Props> {
  public componentDidMount() {
    const { data, setter } = this.props;
    if (data) {
      setter({ raw: data, value: Data(data) });
    }
  }

  public render() {
    return <DataInput onChange={this.setData} />;
  }

  private setData = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    const validData = isValidHex(value);
    this.props.setter({ raw: value, value: validData ? Data(value) : null });
  };
}

interface DefaultProps {
  unit: string;
}

const DefaultDataField: React.SFC<DefaultProps> = (
  /* TODO: check query param of tokens too */
  { unit } // only display if it isn't a token
) =>
  unit === 'ether' ? (
    <SetTransactionField
      name="data"
      withFieldSetter={setter => (
        <Query
          params={['data']}
          withQuery={({ data }) => <DataField data={data} setter={setter} />}
        />
      )}
    />
  ) : null;

export { DefaultDataField as DataField };
