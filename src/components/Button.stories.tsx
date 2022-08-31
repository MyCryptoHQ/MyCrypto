import { ComponentProps, FC } from 'react';

import ButtonComponent from './Button';

export default { title: 'Atoms/Button', component: ButtonComponent };

const Template: FC = (args: ComponentProps<typeof Button>) => <ButtonComponent {...args} />;
export const Button = Template.bind({});
Button.args = {
  children: 'Button'
};
