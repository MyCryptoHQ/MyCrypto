import React from 'react';
import ActionButton from './ActionButton';

export default { title: 'ActionButton' };

export const defaultState = () => <ActionButton value={'Activate'} />;

export const disabled = () => <ActionButton disabled={true} value={'Disabled'} />;

export const loading = () => <ActionButton loading={true} value={'Loading'} />;
