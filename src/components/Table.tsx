/*
  Imported and modified from @mycrypto/ui to style headers
  In order to style the headers particularyly the Icon caret
*/

import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';
import path from 'ramda/src/path';
import isFunction from 'lodash/isFunction';

import { noOp } from '@utils';
import { SPACING } from '@theme';

import { default as Typography } from './Typography';
import IconArrow from './IconArrow';

export interface TableGroup {
  title: string;
  entries: ReactNode[][];
}

type sortFunctionType = (heading?: string | null) => (a: any, b: any) => number;

export interface TableConfig {
  sortableColumn?: string | string[];
  reversedColumns?: string[];
  sortFunction?: sortFunctionType;
  overlayRoot?: boolean;
  maxHeight?: string;
  handleRowClicked?(index: number): void;
}

export interface TableContent {
  body: ReactNode[][];
  groups?: TableGroup[];
}

export interface TableData extends TableContent {
  head: (string | JSX.Element)[];
  overlay?: ReactNode;
  overlayRows?: (number | string)[];
  selectedIndexes?: [];
  config?: TableConfig;
}

export enum ColumnDirections {
  Forward,
  Reverse
}

type Props = TableData;

interface State {
  collapsedGroups: {
    [title: string]: boolean;
  };
  sortedColumnDirection: ColumnDirections;
  currentSortColumn: string | null;
}

interface CellProps {
  isReversed?: boolean;
}

const sharedCellProperties = ({ isReversed }: CellProps) => `
  min-width: .75em;
  padding: .75em;
  text-align: ${isReversed ? 'right' : 'left'};
  & >
`;

const TableHead = styled.tr`
  border-bottom: 0.0625em solid ${(props) => props.theme.tableHeadBorder};
  background: ${(props) => props.theme.tableHeadBackground};
  font-size: 0.9em;
  & > th:first-child {
    padding-left: ${SPACING.BASE};
  }
  & > th:last-child {
    padding-right: ${SPACING.BASE};
  }
`;

interface TableHeadingProps extends CellProps {
  isSortable?: boolean;
  role?: string;
  colSpan?: number;
}

const TableHeading = styled(Typography)<TableHeadingProps>`
  ${sharedCellProperties}
  color: ${(props) => props.theme.headline};
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.0625em;
  border-top: '0px';
  position: sticky;
  top: 0;
  background: ${(props) => props.theme.tableHeadBackground};
  z-index: 2;
  cursor: ${(props) => (props.isSortable ? 'pointer' : 'inherit')};
`;

TableHeading.defaultProps = {
  as: 'th'
};

export const TableRow = styled.tr<{ selected?: boolean }>`
  ${(p) => p.selected && 'background: rgba(179, 221, 135, 0.1);'}
  border-bottom: 0.0625em solid ${(props) => props.theme.tableRowBorder};
  & > td:first-child {
    padding-left: ${SPACING.BASE};
  }
  & > td:last-child {
    padding-right: ${SPACING.BASE};
  }
`;

const TableGroupHead = styled(TableRow)`
  text-transform: uppercase;
  cursor: pointer;
`;

export const TableCell = styled(Typography)`
  ${sharedCellProperties};
`;

const SortPlaceholder = styled.div`
  width: calc(9px + 0.5em);
  display: inline-block;
`;

TableCell.defaultProps = {
  as: 'td'
};

export const defaultColumnSort = () => (a: any, b: any): number => {
  try {
    const aText = a.props.children;
    const bText = b.props.children;

    return aText.localeCompare(bText);
  } catch (error) {
    throw new Error(`The default column sort of <Table /> expects either a string or a single-nested React element for cell contents.
    For anything else, provide a custom sortFunction in the config.`);
  }
};

const getHeaderColumn = (head: JSX.Element | string): string => {
  if (typeof head === 'string') {
    return head;
  } else if (typeof head === 'object' && head.key) {
    return head.key as string;
  }
  throw new Error('Header should be either a string or JSX element with key identifier');
};

const getHeaderColumns = (head: (JSX.Element | string)[]): string[] => head.map(getHeaderColumn);

export const getSortedRows = (
  head: any[],
  body: ReactNode[][],
  config: TableConfig,
  sortedColumnDirection: ColumnDirections,
  currentSortColumn: string | null
): ReactNode[][] => {
  const { sortFunction = defaultColumnSort } = config;
  // Determine which column to order.
  const headerColumns = getHeaderColumns(head);
  const sortableColumnIndex = Math.max(headerColumns.indexOf(currentSortColumn || ''), 0);
  // Create an array containing the data from each row in the specified column.
  const sortableColumnEntries = body
    .map((row) => row[sortableColumnIndex])
    .map((entry) =>
      // If the entry is a string, wrap it.
      typeof entry === 'string' ? <React.Fragment>{entry}</React.Fragment> : entry
    );
  // Rearrange that array based on the selected sort.
  const sortedColumnEntries = [...sortableColumnEntries].sort(sortFunction(currentSortColumn));
  // Translate the new order into the indexes of the original order to determine the change.
  const sortedColumnIndices = sortedColumnEntries.map((sortedEntry) =>
    sortableColumnEntries.indexOf(sortedEntry)
  );
  // Potentially reverse the new order depending on the sort direction.
  const finalSortedColumnIndices =
    sortedColumnDirection === ColumnDirections.Forward
      ? sortedColumnIndices
      : sortedColumnIndices.reverse();
  // Apply the new order to all of the rows.
  const sortedRows = finalSortedColumnIndices.map((index) => body[index]);

  return sortedRows;
};

class AbstractTable extends Component<Props, State> {
  public static defaultProps = {
    head: [],
    body: [],
    groups: [],
    config: {}
  };

  public state: State = {
    collapsedGroups: {},
    sortedColumnDirection: ColumnDirections.Forward,
    currentSortColumn: null
  };

  public componentDidMount() {
    this.verifyTableLayout();
  }

  public render() {
    const { head, config, overlay, overlayRows, selectedIndexes, ...rest } = this.props;
    const { collapsedGroups, sortedColumnDirection } = this.state;
    const { overlayRoot } = config || { overlayRoot: false };
    const { body, groups } = this.getSortedLayout();

    const isReversedColumn = (heading: any) =>
      config && config.reversedColumns && config.reversedColumns.includes(heading);
    return (
      <table {...rest}>
        <thead>
          <TableHead>
            {head.map((heading, index) => {
              const isSelectedSortableColumn = this.isCurrentColumnSortable(
                getHeaderColumn(heading)
              );
              const isSortableColumn = this.isColumnSortable(getHeaderColumn(heading));

              return (
                <TableHeading
                  key={index}
                  onClick={() =>
                    isSortableColumn
                      ? this.toggleSortedColumnDirection(getHeaderColumn(heading))
                      : noOp
                  }
                  role={isSortableColumn ? 'button' : ''}
                  isSortable={isSortableColumn}
                  isReversed={isReversedColumn(heading)}
                  data-testid={isSortableColumn ? 'sortable-column-heading' : ''}
                >
                  {heading}
                  {isSortableColumn &&
                    (isSelectedSortableColumn ? (
                      <IconArrow isFlipped={sortedColumnDirection === ColumnDirections.Reverse} />
                    ) : (
                      <SortPlaceholder />
                    ))}
                </TableHeading>
              );
            })}
          </TableHead>
        </thead>
        <tbody>
          {/* Ungrouped rows are placed on top of grouped rows. */}
          {body.map((row, rowIndex) => {
            const primaryRowKey =
              overlayRoot &&
              row.length &&
              row[0] &&
              row[0].hasOwnProperty('key') &&
              (row[0] as any).key;
            if (primaryRowKey && overlayRows!.includes(primaryRowKey)) {
              return (
                <React.Fragment key={rowIndex}>
                  {isFunction(overlay) ? overlay(primaryRowKey) : overlay}
                </React.Fragment>
              );
            }

            const isOverlayRowIncluded = overlay && overlayRows!.includes(rowIndex);
            const overlayRow =
              isOverlayRowIncluded && isFunction(overlay) ? overlay(rowIndex) : overlay;
            const isSelected = (index) =>
              selectedIndexes && selectedIndexes.includes(index) ? true : false;
            return (
              <TableRow
                key={rowIndex}
                onClick={() => this.handleRowClicked(rowIndex)}
                selected={isSelected(rowIndex)}
              >
                {isOverlayRowIncluded ? (
                  // @todo: Solve jump in th width when the overlay is toggled.
                  <td colSpan={head.length}>{overlayRow}</td>
                ) : (
                  row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      isReversed={isReversedColumn(head[cellIndex])}
                      data-testid={`ungrouped-${rowIndex}-${cellIndex}`}
                    >
                      {cell}
                    </TableCell>
                  ))
                )}
              </TableRow>
            );
          })}
          {groups!.map(({ title, entries }) => (
            <React.Fragment key={title}>
              <TableGroupHead onClick={this.toggleCollapseGroup.bind(this, title)} role="button">
                <TableHeading colSpan={head.length}>
                  {title}
                  <IconArrow isFlipped={collapsedGroups[title]} />
                </TableHeading>
              </TableGroupHead>
              {/* Display group rows if not collapsed. */}
              {!collapsedGroups[title] &&
                entries.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} isReversed={isReversedColumn(head[cellIndex])}>
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  }

  private readonly isCurrentColumnSortable = (heading: string) => {
    return this.getCurrentColumnSortable() === heading;
  };

  private readonly getCurrentColumnSortable = () => {
    const { currentSortColumn } = this.state;
    const { config } = this.props;
    const { sortableColumn } = config || {};

    if (currentSortColumn) {
      return currentSortColumn;
    } else if (sortableColumn && typeof sortableColumn === 'string') {
      return sortableColumn;
    } else if (sortableColumn && Array.isArray(sortableColumn)) {
      return sortableColumn[0];
    }

    return null;
  };

  private readonly isColumnSortable = (column: string) => {
    const { config } = this.props;
    const { sortableColumn } = config || {};

    if (Array.isArray(sortableColumn)) {
      return sortableColumn.some((c) => c.includes(column));
    }

    return typeof sortableColumn === column;
  };

  private readonly verifyTableLayout = () => {
    const { head, body, groups, config } = this.props;
    const columnCount = head.length;

    if (columnCount === 0) {
      throw new Error('A <Table /> must have at least one column.');
    }

    body.forEach((row, index) => {
      if (row.length !== columnCount) {
        throw new Error(`Unbalanced row found in <Table /> at position ${index}.`);
      }
    });

    groups!.forEach(({ title, entries }) => {
      if (!title || title === '') {
        throw new Error(`Untitled group in <Table /> -- all table groups must have a title.`);
      }

      entries.forEach((row, index) => {
        if (row.length !== columnCount) {
          throw new Error(
            `Unbalanced row in group "${title}" found in <Table /> at position ${index}.`
          );
        }
      });
    });

    const { sortableColumn } = config!;

    if (sortableColumn) {
      const returnNonexistentColumn = () => {
        throw new Error(`Nonexistent sortable column provided to <Table />.`);
      };

      const headerIdentifiers = getHeaderColumns(head);
      if (
        Array.isArray(sortableColumn) &&
        sortableColumn.some((c) => !headerIdentifiers.includes(c))
      ) {
        return returnNonexistentColumn();
      } else if (
        typeof sortableColumn === 'string' &&
        !headerIdentifiers.includes(sortableColumn)
      ) {
        return returnNonexistentColumn();
      }
    }
  };

  private readonly toggleCollapseGroup = (title: string) =>
    this.setState((prevState) => ({
      collapsedGroups: {
        ...prevState.collapsedGroups,
        [title]: !prevState.collapsedGroups[title]
      }
    }));

  private readonly toggleSortedColumnDirection = (currentSortColumn: string) =>
    this.setState((prevState) => ({
      currentSortColumn,
      sortedColumnDirection:
        prevState.sortedColumnDirection === ColumnDirections.Forward
          ? ColumnDirections.Reverse
          : ColumnDirections.Forward
    }));

  private readonly getSortedLayout = (): TableContent => {
    const { head, body, groups, config } = this.props;
    const { sortedColumnDirection } = this.state;
    const currentSortColumn = this.getCurrentColumnSortable();

    return config && config.sortableColumn
      ? {
          body: getSortedRows(head, body, config, sortedColumnDirection, currentSortColumn),
          groups: groups!.map((group) => ({
            ...group,
            entries: getSortedRows(
              head,
              group.entries,
              config,
              sortedColumnDirection,
              currentSortColumn
            )
          }))
        }
      : { body, groups };
  };

  private handleRowClicked = (rowIndex: number) => {
    const { config, overlay, overlayRows } = this.props;

    // no click if overlay is shown or no handler function present
    if ((overlay && overlayRows!.includes(rowIndex)) || !path(['handleRowClicked'], config)) return;

    config!.handleRowClicked!(rowIndex);
  };
}

export const Table = styled(AbstractTable)`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

export default Table;
