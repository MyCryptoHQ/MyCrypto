import React, { ReactElement } from 'react';
import './OnboardSlide.scss';

interface Props {
  header: ReactElement<any> | string;
  content: ReactElement<any>;
  slideImage: string;
}

class OnboardSlide extends React.Component<Props> {
  public render() {
    return (
      <div className="OnboardSlide">
        <h3 className="OnboardSlide-header">{this.props.header}</h3>
        <div className="OnboardSlide-body">
          <section className="OnboardSlide-content">{this.props.content}</section>
          <div className="OnboardSlide-image">
            <img src={this.props.slideImage} />
          </div>
        </div>
      </div>
    );
  }
}

export default OnboardSlide;
