import React, { Component, SetStateAction, Dispatch } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Sector, Cell } from 'recharts';

import { Balance } from './types';
import { SMALLEST_CHART_SHARE_SUPPORTED } from './WalletBreakdownView';

const MainWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  padding-right: 24px;
`;

interface BreakdownChartProps {
  balances: Balance[];
  selectedAssetIndex: number;
  setSelectedAssetIndex: Dispatch<SetStateAction<number>>;
}
interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  ticker: string;
  index: number;
}
interface ActiveSectionProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  percent: number;
  fill: string;
  activeIndex: number;
}

export default class BreakdownChart extends Component<BreakdownChartProps> {
  public isChartAnimating = false;

  // Make active section bigger than the rest
  public ActiveSection = (props: ActiveSectionProps) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 20}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  public CustomLabel = (labelProps: CustomLabelProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, ticker, index } = labelProps;
    const { selectedAssetIndex } = this.props;

    const isActiveSection = selectedAssetIndex === index;
    const centerOffset = isActiveSection ? 0.7 : 0.6;

    // Position the label in the center of the pie section
    const radian = Math.PI / 180;
    const radius = (innerRadius + (outerRadius - innerRadius)) * centerOffset;
    const x = percent < 1 ? cx + radius * Math.cos(-midAngle * radian) : cx;
    const y = percent < 1 ? cy + radius * Math.sin(-midAngle * radian) : cy;

    // Don't show the label if percent is 3%
    return percent > SMALLEST_CHART_SHARE_SUPPORTED ? (
      <text x={x} y={y} fill="white" textAnchor={'middle'} dominantBaseline="central">
        {ticker}
      </text>
    ) : (
      <text />
    );
  };

  // Generate colors for all sections of the pie
  public generateColors = (length: number) => {
    const startColor = { r: 223, g: 215, b: 245 };
    const endColor = { r: 166, g: 130, b: 255 };

    const colors = [];
    const step = length > 1 ? 1 / (length - 1) : 0;

    for (let i = 0; i < length; i++) {
      const ratio = i * step;
      const r = Math.ceil(startColor.r * ratio + endColor.r * (1 - ratio));
      const g = Math.ceil(startColor.g * ratio + endColor.g * (1 - ratio));
      const b = Math.ceil(startColor.b * ratio + endColor.b * (1 - ratio));
      colors.push('#' + r.toString(16) + g.toString(16) + b.toString(16));
    }
    return colors;
  };

  public handleMouseEnter = (_: any, index: number) => {
    // Ignore mouse enter while animating the chart
    if (this.isChartAnimating) {
      return;
    }

    this.props.setSelectedAssetIndex(index);
  };

  public render() {
    const { balances, selectedAssetIndex } = this.props;
    const COLORS = this.generateColors(balances.length);
    return (
      <MainWrapper>
        <PieChart width={400} height={350}>
          <Pie
            activeIndex={selectedAssetIndex}
            activeShape={this.ActiveSection}
            data={balances}
            cx={200}
            cy={200}
            innerRadius={0}
            outerRadius={110}
            label={this.CustomLabel}
            labelLine={false}
            dataKey="fiatValue"
            onMouseEnter={this.handleMouseEnter}
            animationDuration={800}
            onAnimationStart={() => (this.isChartAnimating = true)}
            onAnimationEnd={() => (this.isChartAnimating = false)}
          >
            {balances.map((entry, index) => (
              <Cell fill={COLORS[index]} stroke={COLORS[index]} key={entry.name} />
            ))}
          </Pie>
        </PieChart>
      </MainWrapper>
    );
  }
}
