import React from 'react';
import { useTable, Column } from 'react-table';
import styled from 'styled-components';
import { COLORS } from '@theme';

const Table = styled.table`
  height: 100%;
  width: 100%;
`;

const TableHead = styled.thead`
  border-top: 1px solid ${COLORS.GREY_ATHENS};
  border-bottom: 1px solid ${COLORS.GREY_ATHENS};
  background: ${COLORS.BLUE_GREY_LIGHTEST};
  text-transform: uppercase;
  color: ${COLORS.BLUE_DARK_SLATE};
`;

const BodyRow = styled.tr`
  height: 60px;
  border-bottom: 1px solid ${COLORS.GREY_ATHENS};
  &:hover {
    background: rgba(179, 221, 135, 0.3);
  }
`;

const TableHeading = styled.th`
  height: 50px;
`;

interface AccountsTableProps {
  data: any[];
  columns: Column<any>[];
}

const AccountsTable = ({ columns, data }: AccountsTableProps) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  console.log(data);

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableHeading {...column.getHeaderProps()}>{column.render('Header')}</TableHeading>
            ))}
          </tr>
        ))}
      </TableHead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <BodyRow {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </BodyRow>
          );
        })}
      </tbody>
    </Table>
  );
};

export default AccountsTable;
