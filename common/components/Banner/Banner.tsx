import React from 'react';

import './Banner.scss';
import announcementSVG from 'assets/images/icn-announcement.svg';

interface Props {
  value: JSX.Element;
}

export const ANNOUNCEMENT_MSG = () => (
  <React.Fragment>
    <div>
      We've launched a new beta version of MyCrypto that you can try at{' '}
      <a href="https://beta.mycrypto.com">beta.mycrypto.com</a>!
    </div>
  </React.Fragment>
);
const Container = ({ children }: any) => <div className="BannerContainer">{children}</div>;

export const Banner = ({ value }: Props) => {
  return (
    <Container>
      <img src={announcementSVG} alt="Announcmenent" />
      {value}
    </Container>
  );
};

export default Banner;
