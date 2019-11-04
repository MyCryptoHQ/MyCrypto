import classnames from 'classnames';

export const generateMenuIcon = (condition: boolean): string =>
  classnames('fa', {
    'fa-bars': !condition,
    'fa-close': condition
  });

export const generateCaretIcon = (condition: boolean): string =>
  classnames('fa', {
    'fa-caret-down': !condition,
    'fa-caret-right': condition
  });
