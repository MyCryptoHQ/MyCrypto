import React, { ReactElement } from 'react';
import './OnboardSlide.scss';

interface Props {
  header: ReactElement<any> | string;
  content: ReactElement<any>;
}

class OnboardSlide extends React.Component<Props> {
  public render() {
    return (
      <div>
        <article className="OnboardSlide">
          <h3 className="OnboardSlide-header">{this.props.header}</h3>
          <section className="OnboardSlide-content">{this.props.content}</section>
        </article>
      </div>
    );
  }
}

export default OnboardSlide;
