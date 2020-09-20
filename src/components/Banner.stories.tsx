import React from 'react';

import { BannerType } from '@types';

import { Banner } from './Banner';

export default { title: 'Banner' };

export const announcement = () => (
  <Banner value="I'm an announcement banner!" type={BannerType.ANNOUNCEMENT} />
);

// Uncomment this for Figma support:
/*
(announcement as any).story = {
  name: 'Announcement',
  parameters: {
    design: {
      type: 'figma',
      url: '<FIGMA URL HERE>'
    }
  }
};
*/
