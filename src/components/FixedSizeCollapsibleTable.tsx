import React from 'react';
import styled from 'styled-components';
import CollapsibleTable, { CollapsibleTableData } from './CollapsibleTable';

interface TableContainerProps {
  maxHeight: string;
}

const TableContainer = styled.div<TableContainerProps>`
  max-height: ${({ maxHeight }) => maxHeight};
  overflow: auto;
`;

interface FixedTableProps extends CollapsibleTableData {
  breakpoint?: number;
  maxHeight?: string;
}

const FixedSizeCollapsibleTable = ({
  head,
  body,
  groups,
  config,
  breakpoint,
  overlay,
  overlayRows,
  maxHeight = '650px',
  selectedIndexes
}: FixedTableProps) => (
  <TableContainer maxHeight={maxHeight}>
    <CollapsibleTable
      head={head}
      body={body}
      groups={groups}
      config={config}
      breakpoint={breakpoint}
      overlay={overlay}
      overlayRows={overlayRows}
      selectedIndexes={selectedIndexes}
    />
  </TableContainer>
);

export default FixedSizeCollapsibleTable;
