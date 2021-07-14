import styled from 'styled-components';

import { COLORS } from '@theme';
import { Tab } from '@types';

const { WHITE, BLUE_BRIGHT } = COLORS;

const TabsWrapper = styled.div`
  border: 1px solid ${BLUE_BRIGHT};
  display: flex;
  font-size: 16px;
  color: ${BLUE_BRIGHT};
  font-weight: normal;
  border-radius: 2px;
  background-color: ${WHITE};
  cursor: pointer;
`;

interface TabWrapperProps {
  selected: boolean;
}

const TabWrapper = styled.div<TabWrapperProps>`
  ${(props) =>
    props.selected &&
    `background-color: ${BLUE_BRIGHT};
     color: ${WHITE};`}
  padding: 12px 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  &:not(:first-child) {
    border-left: 1px solid ${BLUE_BRIGHT};
  }
`;

interface TabsProps {
  tabs: Tab[];
  selectedIndex: number;
}

export default function Tabs({ tabs, selectedIndex }: TabsProps) {
  return (
    <TabsWrapper>
      {tabs.map((tab, index: number) => (
        <TabWrapper key={index} selected={index === selectedIndex} onClick={tab.onClick}>
          {tab.title}
        </TabWrapper>
      ))}
    </TabsWrapper>
  );
}
