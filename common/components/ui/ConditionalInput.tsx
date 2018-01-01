import React from 'react';
import { withConditional } from 'components/hocs';

const Input: React.SFC<React.InputHTMLAttributes<any>> = props => <input {...props} />;
export const ConditionalInput = withConditional(Input);
