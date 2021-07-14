import { ComponentProps } from 'react';

import Icon from './Icon';
import LinkAppComponent from './LinkApp';

export default { title: 'Atoms/LinkApp', component: LinkAppComponent };

const Template = (args: ComponentProps<typeof LinkAppComponent>) => (
  <LinkAppComponent {...args} href="#" />
);

export const OpacityLink = Template.bind({});
OpacityLink.args = {
  variant: 'opacityLink',
  children: (
    <>
      {'Hello'} <Icon type="edit" size="1em" />
    </>
  )
};
