import * as React from 'react';

export class Name extends React.Component<{ value: string }, any> {
  public render(): JSX.Element {
    return (
      <section className="form-group">
        <label>Name</label>
        <section className="input-group col-xs-12">
          <input readOnly={true} type="text" className="form-control" value={this.props.value} />
          <div className="input-group-btn">
            <a className="btn btn-default">.eth</a>
          </div>
        </section>
      </section>
    );
  }
}
