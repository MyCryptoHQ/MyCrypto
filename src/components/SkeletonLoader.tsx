import React from 'react';

import ContentLoader from 'react-content-loader';

const svgs = {
  'wallet-chart': {
    viewBox: '0 0 250 250',
    svg: <circle cx="125" cy="140" r="80" />
  },
  'wallet-chart-total': {
    viewBox: '0 0 187 49',
    svg: (
      <>
        <rect width="112" height="26" />
        <rect y="36" width="187" height="13" />
      </>
    )
  },
  'wallet-breakdown-balances': {
    viewBox: '0 0 260 205',
    svg: (
      <path d="M 0 0 h 112 v 26 H 0 z M 0 79 h 112 v 26 H 0 z M 0 158 h 112 v 26 H 0 z M 197 0 h 63 v 26 h -63 z M 197 79 h 63 v 26 h -63 z M 197 158 h 63 v 26 h -63 z M 0 34 h 55 v 13 H 0 z M 0 113 h 55 v 13 H 0 z M 0 192 h 55 v 13 H 0 z" />
    )
  },
  'wallet-breakdown-totals': {
    viewBox: '0 0 260 26',
    svg: (
      <>
        <rect width="112" height="26" />
        <rect x="197" width="63" height="26" />
      </>
    )
  },
  'token-list': {
    viewBox: '0 0 311 142',
    svg: (
      <>
        <circle cx="13" cy="13" r="13" />
        <circle cx="13" cy="71" r="13" />
        <circle cx="13" cy="129" r="13" />
        <path d="M 42 0 h 112 v 26 H 42 z M 42 58 h 112 v 26 H 42 z M 42 116 h 112 v 26 H 42 z" />
      </>
    )
  },
  'account-list-value': {
    viewBox: '0 0 116 18',
    svg: <rect y="18" width="18" height="116" transform="rotate(-90 0 18)" />
  },
  'wallet-breakdown-total-small': {
    viewBox: '0 0 187 13',
    svg: <rect width="187" height="13" />
  }
};

interface Props {
  type: keyof typeof svgs;
  width?: number;
  height?: number;
}

export const SkeletonLoader = ({ type, width, height }: Props) => {
  const { svg, viewBox } = svgs[type];
  return (
    <ContentLoader
      speed={2}
      width={width}
      height={height}
      viewBox={viewBox}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {svg}
    </ContentLoader>
  );
};
