import { RouteComponentProps } from 'react-router-dom';
import { Omit } from 'react-redux';

interface IProps {
  match: RouteComponentProps<any>['match'];
  location: Omit<RouteComponentProps<any>['location'], 'state'>;
  history: {
    length: RouteComponentProps<any>['history']['length'];
    action: RouteComponentProps<any>['history']['action'];
    location: RouteComponentProps<any>['history']['location'];
  };
}

export const createMockRouteComponentProps = (props: IProps): RouteComponentProps<any> => ({
  location: { state: {}, ...props.location },
  match: {
    ...props.match
  },
  history: {
    push: () => null,
    replace: () => null,
    createHref: () => '',
    block: () => () => null,
    go: () => null,
    goBack: () => null,
    goForward: () => null,
    listen: () => () => null,
    location: { state: {}, ...props.history.location },
    ...props.history
  }
});
