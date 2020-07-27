import React from 'react';
import {
  useTable,
  useRowSelect,
  Column,
  TableRowProps,
  UseRowSelectRowProps,
  Row
} from 'react-table';
import styled from 'styled-components';
import Icon from '@components/Icon';
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

const BodyRow = styled.tr<TableRowProps & UseRowSelectRowProps<any>>`
  ${(p) => p.isSelected && `background: rgba(179, 221, 135, 0.1);`}
  height: 60px;
  border-bottom: 1px solid ${COLORS.GREY_ATHENS};
  &:hover {
    background: rgba(179, 221, 135, 0.3);
  }
`;

const TableHeading = styled.th`
  height: 50px;
`;

const CheckContainer = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  border-left: 6px solid ${(p) => (p.isSelected ? `${COLORS.LIGHT_GREEN}` : 'transparent')};
  width: 30px;
  padding-left: 10px;
  margin-right: 10px;
`;

interface AccountsTableProps {
  data: any[];
  columns: Column<any>[];
}

const AccountsTable = ({ columns, data }: AccountsTableProps) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: '',
          Cell: ({ row }: { row: Row & UseRowSelectRowProps<any> }) => (
            <CheckContainer isSelected={row.isSelected}>
              {row.isSelected && <Icon type="check" />}
            </CheckContainer>
          )
        },
        ...columns
      ]);
    }
  );

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
        {rows.map((row: Row & UseRowSelectRowProps<any>) => {
          prepareRow(row);
          return (
            <BodyRow
              {...row.getRowProps()}
              key={row.id}
              isSelected={row.isSelected}
              onClick={() => {
                row.toggleRowSelected();
              }}
            >
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
