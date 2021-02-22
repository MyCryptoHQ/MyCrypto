import React from 'react';

import ButtonComponent from './Button';

export default { title: 'Atoms/Button', component: ButtonComponent };

const Template: React.FC = (args: React.ComponentProps<typeof Button>) => (
  <ButtonComponent {...args} />
);
export const Button = Template.bind({});
Button.args = {
  children: 'Button'
};
