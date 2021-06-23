import { ComponentProps } from 'react';

import Box from './Box';
import CollapsibleTable from './CollapsibleTable';

const FixedSizeCollapsibleTable = ({
  maxHeight = '650px',
  ...props
}: ComponentProps<typeof CollapsibleTable> & { maxHeight?: string }) => (
  <Box maxHeight={maxHeight} overflow="auto">
    <CollapsibleTable {...props} />
  </Box>
);

export default FixedSizeCollapsibleTable;
