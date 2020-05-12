import React from 'react';
import Button from './Button';

export default { title: 'Button' };

export const defaultState = () => <Button>Activate</Button>;

export const disabled = () => <Button disabled={true}>Disabled</Button>;

export const loading = () => <Button loading={true}>Loading</Button>;
