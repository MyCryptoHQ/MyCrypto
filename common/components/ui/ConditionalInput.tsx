import React from 'react';
import { withConditional } from 'components/hocs';
import { Input } from 'components/ui';

const inpt: React.SFC<React.InputHTMLAttributes<any>> = props => <Input {...props} />;
export const ConditionalInput = withConditional(inpt);
