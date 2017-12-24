import React from 'react';
import classnames from 'classnames';
import { TranslateType } from 'translations';
import { Link } from 'react-router-dom';
import './SubTabs.scss';

export interface Tab<SubTabProps = null> {
  path: string;
  name: TranslateType;
  isDisabled?(props: SubTabProps | {}): boolean;
  render(props: SubTabProps | {}): React.ReactElement<any> | null;
}

export interface Props<SubTabProps = null> {
  activeTab?: string;
  root: string;
  tabs: Tab<SubTabProps>[];
  sideBar?: React.ReactElement<any> | React.Component | React.StatelessComponent;
  subTabProps?: SubTabProps;
  onTabChange?(): void;
}

interface State {
  isOpenModal: boolean;
}

export default class SubTabs<SubTabProps = null> extends React.Component<
  Props<SubTabProps>,
  State
> {
  public render() {
    const { tabs, sideBar } = this.props;
    const activeTab = this.props.activeTab || tabs[0].path;
    const tab = tabs.find(t => t.path === activeTab) || tabs[0];
    const columnSize = sideBar ? 8 : 12;

    return (
      <div className="SubTabs row">
        <div className={`SubTabs-tabs col-sm-${columnSize}`}>
          {tabs.map(t => (
            <Link
              className={classnames({
                'SubTabs-tabs-link': true,
                'is-active': t.path === activeTab,
                'is-disabled': t.isDisabled && t.isDisabled(this.props.subTabProps || {})
              })}
              to={`/${this.props.root}/${t.path}`}
              key={t.path}
              onClick={this.props.onTabChange}
            >
              {t.name}
            </Link>
          ))}
        </div>

        <main className={`SubTabs-content col-sm-${columnSize}`} key={tab.path}>
          {tab.render(this.props.subTabProps || {})}
        </main>
        {this.props.sideBar ? this.props.sideBar : null}
      </div>
    );
  }
}
