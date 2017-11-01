import React, { Component } from 'react';

interface Props {
  content: React.ReactElement<any>;
  title: string;
}

class RestoreKeystoreTemplate extends Component<Props, {}> {
  public render() {
    const { title, content } = this.props;
    return (
      <div className="Tab-content">
        <div className="Tab-content-pane text-center">
          <h1>{title}</h1>
          {content}
        </div>
      </div>
    );
  }
}

export default RestoreKeystoreTemplate;
