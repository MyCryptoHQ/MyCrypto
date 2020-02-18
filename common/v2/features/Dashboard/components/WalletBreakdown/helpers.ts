export const calculateShownIndex = (
  numberOfPieChartSlices: number,
  selectedIndex: number
): number => {
  // selectedIndex is the index of the asset balance element that is being hovered over.
  // chartBalancesLength is the number of slices in the WalletBreakdown pie chart.
  if (numberOfPieChartSlices > selectedIndex && selectedIndex !== -1) {
    // This will "select" the relevant onHovered slice.
    return selectedIndex;
  } else if (numberOfPieChartSlices <= selectedIndex) {
    // This will "select" the last element in the chartBalances array, which is the combined "other tokens" slice.
    return numberOfPieChartSlices - 1;
  }
  // Default to "selecting" the largest slice in the pie chart.
  return 0;
};
