/*
  Imported and modified from @mycrypto/ui to style headers
  In order to style the headers particularyly the Icon caret
*/

import React, {
  ClassAttributes,
  Component,
  DetailedHTMLProps,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes
} from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import { Theme } from '@mycrypto/ui';

import { default as Typography } from './Typography';
import { default as IconCaret } from './IconCaret';

export interface TableGroup {
  title: string;
  entries: ReactNode[][];
  offset?: number;
}

export interface TableConfig {
  sortableColumn?: string | null;
  hiddenHeadings?: (string | JSX.Element)[]; //Hack to allow a head to include JSX.Elements
  reversedColumns?: string[];
  sortFunction?(a: any, b: any): number;
}

export interface TableContent {
  body: ReactNode[][];
  groups?: TableGroup[];
}

export interface TableData extends TableContent {
  head: (string | JSX.Element)[];
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
}

interface CellProps {
  isReversed?: boolean;
}

const sharedCellProperties = ({ isReversed }: CellProps) => `
  min-width: 1em;
  padding: 1em;
  text-align: ${isReversed ? 'right' : 'left'};
`;

const TableHead = styled.tr`
  border-top: 0.0625em solid ${props => props.theme.tableHeadBorder};
  border-bottom: 0.0625em solid ${props => props.theme.tableHeadBorder};
  background: ${props => props.theme.tableHeadBackground};
  font-size: 0.9em;
`;

interface HeadingProps extends CellProps {
  isSortable?: boolean;
  isHidden?: boolean;
}

const TableHeading = styled(Typography)<HeadingProps>`
  ${sharedCellProperties}
  color: ${props => props.theme.headline};
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.0625em;
  cursor: ${props => (props.isSortable ? 'pointer' : 'inherit')}
    ${props =>
      props.isHidden &&
      `
    position: fixed;
    top: -9999em;
    left: -9999em;
  `};
` as StyledComponentClass<
  ClassAttributes<HTMLTableHeaderCellElement> &
    ThHTMLAttributes<HTMLTableHeaderCellElement> &
    HeadingProps,
  Theme
>;

TableHeading.defaultProps = {
  as: 'th'
};

const TableRow = styled.tr`
  border-bottom: 0.0625em solid ${props => props.theme.tableRowBorder};
`;

const TableGroupHead = styled(TableRow)`
  text-transform: uppercase;
  cursor: pointer;
`;

const TableCaret = styled(IconCaret)<{ isFlipped?: boolean }>`
  margin-left: 0.5em;
  ${props =>
    props.isFlipped &&
    `
    svg {
      transform: rotateX(180deg);
    }
  `};
`;

const TableCell = styled(Typography)`
  ${sharedCellProperties};
` as StyledComponentClass<
  DetailedHTMLProps<
    TdHTMLAttributes<HTMLTableDataCellElement> & CellProps,
    HTMLTableDataCellElement
  >,
  Theme
>;

TableCell.defaultProps = {
  as: 'td'
};

// tslint:disable-next-line
const noop = () => {};

export const defaultColumnSort = (a: any, b: any): number => {
  try {
    const aText = a.props.children;
    const bText = b.props.children;

    return aText.localeCompare(bText);
  } catch (error) {
    throw new Error(`The default column sort of <Table /> expects either a string or a single-nested React element for cell contents.
    For anything else, provide a custom sortFunction in the config.`);
  }
};

export const getSortedRows = (
  head: any[],
  body: ReactNode[][],
  config: TableConfig,
  sortedColumnDirection: ColumnDirections
): ReactNode[][] => {
  const { sortableColumn, sortFunction = defaultColumnSort } = config;
  // Determine which column to order.
  const sortableColumnIndex = head.indexOf(sortableColumn);
  // Create an array containing the data from each row in the specified column.
  const sortableColumnEntries = body
    .map(row => row[sortableColumnIndex])
    .map(entry =>
      // If the entry is a string, wrap it.
      typeof entry === 'string' ? <React.Fragment>{entry}</React.Fragment> : entry
    );
  // Rearrange that array based on the selected sort.
  const sortedColumnEntries = [...sortableColumnEntries].sort(sortFunction);
  // Translate the new order into the indexes of the original order to determine the change.
  const sortedColumnIndices = sortedColumnEntries.map(sortedEntry =>
    sortableColumnEntries.indexOf(sortedEntry)
  );
  // Potentially reverse the new order depending on the sort direction.
  const finalSortedColumnIndices =
    sortedColumnDirection === ColumnDirections.Forward
      ? sortedColumnIndices
      : sortedColumnIndices.reverse();
  // Apply the new order to all of the rows.
  const sortedRows = finalSortedColumnIndices.map(index => body[index]);

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
    sortedColumnDirection: ColumnDirections.Forward
  };

  public componentDidMount() {
    this.verifyTableLayout();
  }

  public render() {
    const { head, config, ...rest } = this.props;
    const { collapsedGroups, sortedColumnDirection } = this.state;
    const { body, groups } = this.getSortedLayout();

    const isReversedColumn = (heading: any) =>
      config && config.reversedColumns && config.reversedColumns.includes(heading);

    return (
      <table {...rest}>
        <thead>
          <TableHead>
            {head.map((heading, index) => {
              const isSortableColumn = config && config.sortableColumn === heading;
              const isHiddenHeading =
                config && config.hiddenHeadings && config.hiddenHeadings.includes(heading);

              return (
                <TableHeading
                  key={index}
                  onClick={isSortableColumn ? this.toggleSortedColumnDirection : noop}
                  role={isSortableColumn ? 'button' : ''}
                  isSortable={isSortableColumn}
                  isHidden={isHiddenHeading}
                  isReversed={isReversedColumn(heading)}
                  data-testid={isSortableColumn ? 'sortable-column-heading' : ''}
                >
                  {heading}
                  {isSortableColumn && (
                    <TableCaret
                      icon="navDownCaret"
                      isFlipped={sortedColumnDirection === ColumnDirections.Reverse}
                    />
                  )}
                </TableHeading>
              );
            })}
          </TableHead>
        </thead>
        <tbody>
          {/* Ungrouped rows are placed on top of grouped rows. */}
          {body.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  isReversed={isReversedColumn(head[cellIndex])}
                  data-testid={`ungrouped-${rowIndex}-${cellIndex}`}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {groups!.map(({ title, entries, offset = 0 }) => (
            <React.Fragment key={title}>
              <TableGroupHead onClick={this.toggleCollapseGroup.bind(this, title)} role="button">
                {/* Enter ghost cells to facilitate the offset. */}
                {Array.from({ length: offset }, (_, index) => (
                  <td key={index} />
                ))}
                <TableHeading colSpan={head.length - offset}>
                  {title}
                  <TableCaret icon="navDownCaret" isFlipped={collapsedGroups[title]} />
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

    groups!.forEach(({ title, entries, offset }) => {
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

      if (offset && offset > columnCount - 1) {
        throw new Error(`Bad offset in group "${title}" found in <Table />.`);
      }
    });

    const { sortableColumn, hiddenHeadings } = config!;

    if (sortableColumn) {
      const sortedColumnExists = head.includes(sortableColumn);

      if (!sortedColumnExists) {
        throw new Error(`Nonexistent sortable column provided to <Table />.`);
      }
    }

    if (hiddenHeadings) {
      hiddenHeadings.forEach(heading => {
        if (!head.includes(heading)) {
          throw new Error(`Unused heading ${heading} found in hiddenHeadings in <Table />`);
        }
      });
    }
  };

  private readonly toggleCollapseGroup = (title: string) =>
    this.setState(prevState => ({
      collapsedGroups: {
        ...prevState.collapsedGroups,
        [title]: !prevState.collapsedGroups[title]
      }
    }));

  private readonly toggleSortedColumnDirection = () =>
    this.setState(prevState => ({
      sortedColumnDirection:
        prevState.sortedColumnDirection === ColumnDirections.Forward
          ? ColumnDirections.Reverse
          : ColumnDirections.Forward
    }));

  private readonly getSortedLayout = (): TableContent => {
    const { head, body, groups, config } = this.props;
    const { sortedColumnDirection } = this.state;

    return config && config.sortableColumn
      ? {
          body: getSortedRows(head, body, config, sortedColumnDirection),
          groups: groups!.map(group => ({
            ...group,
            entries: getSortedRows(head, group.entries, config, sortedColumnDirection)
          }))
        }
      : { body, groups };
  };
}

export const Table = styled(AbstractTable)`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

export default Table;
