import React from 'react';

import Button from './Button';

export default { title: 'Atoms/Button', component: Button };

const Template = (args: React.ComponentProps<typeof Button>) => <Button {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary',
  children: 'Button'
};

export const disabled = () => <Button disabled={true}>Disabled</Button>;

export const loading = () => <Button loading={true}>Loading</Button>;
