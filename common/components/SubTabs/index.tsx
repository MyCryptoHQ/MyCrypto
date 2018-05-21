import React from 'react';
import Select, { Option } from 'react-select';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import './SubTabs.scss';

export interface Tab {
  name: string | React.ReactElement<any>;
  path: string;
  disabled?: boolean;
  redirect?: string;
}

interface OwnProps {
  tabs: Tab[];
}

type Props = OwnProps & RouteComponentProps<{}>;

interface State {
  tabsWidth: number;
  isCollapsed: boolean;
}

export default class SubTabs extends React.PureComponent<Props, State> {
  public state: State = {
    tabsWidth: 0,
    isCollapsed: false
  };

  private containerEl: HTMLDivElement | null;
  private tabsEl: HTMLDivElement | null;

  public componentDidMount() {
    this.measureTabsWidth();
    window.addEventListener('resize', this.handleResize);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    // When new tabs come in, we'll need to uncollapse so that they can
    // be measured and collapsed again, if needed.
    if (this.props.tabs !== nextProps.tabs) {
      this.setState({ isCollapsed: false });
    }
  }

  public componentDidUpdate(prevProps: Props) {
    // New tabs === new measurements
    if (this.props.tabs !== prevProps.tabs) {
      this.measureTabsWidth();
    }
  }

  public render() {
    const { tabs, match } = this.props;
    const { isCollapsed } = this.state;
    const basePath = match.url;
    const currentPath = location.pathname;
    let content: React.ReactElement<string>;

    if (isCollapsed) {
      const options = tabs.map(tab => ({
        label: tab.name as string,
        value: tab.path,
        disabled: tab.disabled
      }));

      content = (
        <div className="SubTabs-select">
          <Select
            options={options}
            value={currentPath.split('/').pop()}
            onChange={this.handleSelect}
            searchable={false}
            clearable={false}
          />
        </div>
      );
    } else {
      // All tabs visible navigation
      content = (
        <div className="SubTabs-tabs" ref={el => (this.tabsEl = el)}>
          {tabs.map((t, i) => (
            <SubTabLink tab={t} basePath={basePath} className="SubTabs-tabs-link" key={i} />
          ))}
        </div>
      );
    }

    return (
      <div className="SubTabs" ref={el => (this.containerEl = el)}>
        {content}
      </div>
    );
  }

  private handleSelect = ({ value }: Option) => {
    this.props.history.push(`${this.props.match.url}/${value}`);
  };

  // Tabs become a dropdown if they would wrap
  private handleResize = () => {
    if (!this.containerEl) {
      return;
    }

    this.setState({
      isCollapsed: this.state.tabsWidth >= this.containerEl.offsetWidth
    });
  };

  // Store the tab width for future
  private measureTabsWidth = () => {
    if (this.tabsEl) {
      this.setState({ tabsWidth: this.tabsEl.offsetWidth }, () => {
        this.handleResize();
      });
    } else {
      // Briefly show, measure, collapse again still not enough room
      this.setState({ isCollapsed: false }, this.measureTabsWidth);
    }
  };
}

interface SubTabLinkProps {
  tab: Tab;
  basePath: string;
  className: string;
  onClick?(ev: React.MouseEvent<HTMLAnchorElement>): void;
}

const SubTabLink: React.SFC<SubTabLinkProps> = ({ tab, className, basePath, onClick }) => (
  <NavLink
    className={`${className} ${tab.disabled ? 'is-disabled' : ''}`}
    activeClassName="is-active"
    to={basePath + '/' + tab.path}
    onClick={onClick}
  >
    {tab.name}
  </NavLink>
);
