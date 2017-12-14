import React from 'react';
import classnames from 'classnames';
import { TranslateType } from 'translations';
import { Link } from 'react-router-dom';
import './SubTabs.scss';

export interface Tab {
  path: string;
  name: TranslateType | string;
  isDisabled?(props?: Props): boolean | null;
  render(props?: Props): React.ReactElement<any>;
}

interface Props {
  activeTab?: string;
  root: string;
  tabs: Tab[];
  sideBar?: React.ReactElement<any> | React.Component | React.StatelessComponent;
}

interface State {
  isOpenModal: boolean;
}

export default class SubTabs extends React.Component<Props, State> {
  public render() {
    const { tabs, sideBar } = this.props;
    const activeTab = this.props.activeTab || tabs[0].path;
    const tab = tabs.find(t => t.path === activeTab) || tabs[0];

    return (
      <div className="SubTabs row">
        <div className={'SubTabs-tabs' && sideBar ? ' col-sm-8' : ''}>
          {tabs.map(t => (
            <Link
              className={classnames({
                'SubTabs-tabs-link': true,
                'is-active': t.path === activeTab,
                'is-disabled': t.isDisabled && t.isDisabled(this.props)
              })}
              to={`/${this.props.root}/${t.path}`}
              key={t.path}
            >
              {t.name}
            </Link>
          ))}
        </div>

        <main className={'SubTabs-content' && sideBar ? ' col-sm-8' : ''} key={tab.path}>
          {tab.render(this.props)}
        </main>
        {this.props.sideBar ? this.props.sideBar : null}
      </div>
    );
  }
}
