import React from 'react';

import './Banner.scss';
import announcementSVG from 'assets/images/icn-announcement.svg';

interface Props {
  value: JSX.Element;
}

export const ANNOUNCEMENT_MSG = () => (
  <React.Fragment>
    <div>
      This is an older version of MyCrypto! We've kept it up for specific use cases but we recommend
      that you use the most up-to-date version of <a href="https://app.mycrypto.com">MyCrypto</a>!
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
