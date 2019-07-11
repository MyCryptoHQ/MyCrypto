import React from 'react';
import Responsive from 'react-responsive';

export const Desktop = (props: any) => <Responsive {...props} minWidth={1080} />;
export const Mobile = (props: any) => <Responsive {...props} maxWidth={1079} />;
