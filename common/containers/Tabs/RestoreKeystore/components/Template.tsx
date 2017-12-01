import React from 'react';

interface Props {
  content: React.ReactElement<any>;
  title: string;
}

const RestoreKeystoreTemplate: React.SFC<Props> = ({ title, content }) => (
  <div className="Tab-content">
    <div className="Tab-content-pane text-center">
      <h1>{title}</h1>
      {content}
    </div>
  </div>
);
export default RestoreKeystoreTemplate;
