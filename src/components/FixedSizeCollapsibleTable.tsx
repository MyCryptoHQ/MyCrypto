import React from 'react';

import Box from './Box';
import CollapsibleTable from './CollapsibleTable';

const FixedSizeCollapsibleTable = ({
  maxHeight = '650px',
  ...props
}: React.ComponentProps<typeof CollapsibleTable> & { maxHeight?: string }) => (
  <Box maxHeight={maxHeight} overflow="auto">
    <CollapsibleTable {...props} />
  </Box>
);

export default FixedSizeCollapsibleTable;
