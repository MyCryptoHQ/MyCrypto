import React, { Component } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Sector, Cell } from 'recharts';

const dummyData = [
  {
    name: 'OMG',
    value: 500
  },
  { name: 'SLK', value: 300 },
  { name: 'DGC', value: 200 },
  { name: 'ETH', value: 150 },
  { name: 'Other', value: 350 }
];

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  padding-right: 24px;
`;

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

const CustomLabel = (props: CustomLabelProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;

  // Position the label in the center of the pie section
  const radian = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = percent < 1 ? cx + radius * Math.cos(-midAngle * radian) : cx;
  const y = percent < 1 ? cy + radius * Math.sin(-midAngle * radian) : cy;

  return (
    <text x={x} y={y} fill="white" textAnchor={'middle'} dominantBaseline="central">
      {name}
    </text>
  );
};

interface ActiveSectionProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  percent: number;
  fill: string;
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

export default class BreakdownChart extends Component {
  public render() {
    const COLORS = generateColors(dummyData.length);

    return (
      <Wrapper>
        <PieChart width={400} height={400}>
          <Pie
            activeIndex={0}
            activeShape={ActiveSection}
            data={dummyData}
            cx={200}
            cy={200}
            innerRadius={0}
            outerRadius={110}
            label={CustomLabel}
            labelLine={false}
            dataKey="value"
          >
            {dummyData.map((entry, index) => (
              <Cell fill={COLORS[index]} stroke={COLORS[index]} key={entry.name} />
            ))}
          </Pie>
        </PieChart>
      </Wrapper>
    );
  }
}
