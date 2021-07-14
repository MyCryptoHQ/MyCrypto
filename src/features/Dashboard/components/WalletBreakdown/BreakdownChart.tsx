import { memo, ReactElement, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import equals from 'ramda/src/equals';
import { Cell, Pie, PieChart, PieLabelRenderProps, Sector } from 'recharts';
import styled from 'styled-components';

import { SkeletonLoader } from '@components';
import { Balance } from '@types';

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
  isChartAnimating: boolean;
  isScanning: boolean;
  shouldAnimate: boolean;
  handleMouseOver(index: number): void;
  handleMouseLeave(index: number): void;
  setIsChartAnimating(isAnimating: boolean): void;
  setShouldAnimate(shouldAnimate: boolean): void;
}
interface CustomLabelProps extends PieLabelRenderProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  ticker?: string;
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

// Make active section bigger than the rest
const ActiveSection = (props: ActiveSectionProps) => {
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

const CustomLabel = (
  labelProps: CustomLabelProps,
  selectedAssetIndex: number,
  handleMouseOver: BreakdownChartProps['handleMouseOver']
): ReactElement<any> => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, ticker, index } = labelProps;

  const isActiveSection = selectedAssetIndex === index;
  const centerOffset = isActiveSection ? 0.7 : 0.6;

  // Position the label in the center of the pie section
  const radian = Math.PI / 180;
  const radius = (innerRadius + (outerRadius - innerRadius)) * centerOffset;
  const x = percent < 1 ? cx + radius * Math.cos(-midAngle * radian) : cx;
  const y = percent < 1 ? cy + radius * Math.sin(-midAngle * radian) : cy;

  // Don't show the label if percent is 3%
  return percent > SMALLEST_CHART_SHARE_SUPPORTED ? (
    <text
      onMouseOver={() => handleMouseOver(index)}
      x={x}
      y={y}
      fill="white"
      textAnchor={'middle'}
      dominantBaseline="central"
    >
      {ticker}
    </text>
  ) : (
    <text />
  );
};

// Generate colors for all sections of the pie
const generateColors = (length: number) => {
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

const BreakdownChart = memo(
  ({
    balances,
    selectedAssetIndex,
    handleMouseOver,
    handleMouseLeave,
    setIsChartAnimating,
    isScanning,
    shouldAnimate,
    setShouldAnimate
  }: BreakdownChartProps) => {
    const COLORS = useMemo(() => generateColors(balances.length), [balances.length]);
    const displayBalances = balances.map((balance) => ({
      ...balance,
      fiatValue: new BigNumber(balance.fiatValue).toNumber()
    }));
    return (
      <MainWrapper>
        {isScanning ? (
          <SkeletonLoader type="wallet-chart" width={400} height={350} />
        ) : (
          <PieChart
            width={400}
            height={350}
            onMouseLeave={() => handleMouseLeave(-1)}
            onMouseEnter={() => handleMouseLeave(-1)}
          >
            <Pie
              isAnimationActive={shouldAnimate}
              activeIndex={selectedAssetIndex}
              activeShape={ActiveSection}
              data={displayBalances}
              cx={200}
              cy={200}
              innerRadius={0}
              outerRadius={110}
              label={(p) => CustomLabel(p as CustomLabelProps, selectedAssetIndex, handleMouseOver)}
              labelLine={false}
              dataKey="fiatValue"
              onMouseEnter={(_: any, index: number) => handleMouseOver(index)}
              onMouseLeave={() => handleMouseLeave(-1)}
              animationDuration={800}
              onAnimationStart={() => setIsChartAnimating(true)}
              onAnimationEnd={() => {
                setShouldAnimate(false);
                setIsChartAnimating(false);
              }}
            >
              {balances.map((entry, index) => (
                <Cell fill={COLORS[index]} stroke={COLORS[index]} key={entry.name} />
              ))}
            </Pie>
          </PieChart>
        )}
      </MainWrapper>
    );
  },
  (prev, next) => next.isChartAnimating || equals(prev, next)
);

export default BreakdownChart;
