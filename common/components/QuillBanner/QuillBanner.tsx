import React from 'react';

import './QuillBanner.scss';
import announcementSVG from 'assets/images/icn-announcement.svg';

interface Props {
  value: JSX.Element;
}

export const ANNOUNCEMENT_MSG = () => (
  <React.Fragment>
    <div>
      Want to level up your MyCrypto experience? Try our{' '}
      <a href="https://app.mycrypto.com/">Web Application</a> along with the{' '}
      <a href="https://app.mycrypto.com/membership">MyCrypto Membership</a>, and download{' '}
      <a href="https://download.mycrypto.com/">Quill</a> - our newest desktop app!
      <br />
      <br />
      What does this mean for the app you're on right now? It will remain available in its current
      state, but our main focus will be on continuously improving the Web Application and Quill.
    </div>
  </React.Fragment>
);
const Container = ({ children }: any) => <div className="QuillBannerContainer">{children}</div>;

export const QuillBanner = ({ value }: Props) => {
  return (
    <Container>
      <img src={announcementSVG} alt="Announcement" />
      {value}
    </Container>
  );
};

export default QuillBanner;
