import { BannerType } from '@types';

import { Banner } from './Banner';

export default { title: 'Molecules/Banner', component: Banner };

export const announcement = () => (
  <Banner value="I'm an announcement banner!" type={BannerType.ANNOUNCEMENT} />
);
