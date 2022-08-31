import { ComponentProps } from 'react';

import { Web3ProviderInstallUI } from './Web3ProviderInstall';

export default {
  title: 'Features/AddAccount/Web3ProviderInstall',
  component: Web3ProviderInstallUI
};

const Template = (args: ComponentProps<typeof Web3ProviderInstallUI>) => {
  return (
    <div className="sb-container" style={{ maxWidth: '620px' }}>
      <Web3ProviderInstallUI {...args} />
    </div>
  );
};

export const Mobile = Template.bind({});
Mobile.args = {
  isMobile: true
};
