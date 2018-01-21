import React, { ReactElement } from 'react';
import './OnboardSlide.scss';

interface Props {
  header: ReactElement<any> | string;
  subheader?: ReactElement<any> | string;
  content: ReactElement<any> | string;
  image: string;
  imageSide: 'left' | 'right';
}

class OnboardSlide extends React.Component<Props> {
  public render() {
    const { header, subheader, content, image, imageSide } = this.props;
    return (
      <div className="OnboardSlide">
        <h3 className="OnboardSlide-header">{header}</h3>
        {subheader && <p className="OnboardSlide-subheader">{subheader}</p>}
        <div className="OnboardSlide-body">
          {imageSide === 'left' && (
            <div className="OnboardSlide-image is-left">
              <img className="OnboardSlide-image-img" src={image} />
            </div>
          )}
          <section className="OnboardSlide-content">{content}</section>
          {imageSide === 'right' && (
            <div className="OnboardSlide-image is-right">
              <img className="OnboardSlide-image-img" src={image} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default OnboardSlide;
