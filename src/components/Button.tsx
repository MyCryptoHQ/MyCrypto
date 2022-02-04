import { Button, ButtonProps } from '@mycrypto/ui';

function StyledButton({ children, ...props }: Omit<ButtonProps, 'css'>) {
  return <Button {...props}>{children}</Button>;
}

export default StyledButton;
