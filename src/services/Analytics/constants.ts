export type TAnalyticEvents =
  | 'App Load'
  | 'Add Account'
  | 'Add Asset'
  | 'Link clicked'
  | 'Donate clicked' // User copies ETH or BTC address to clipboard.
  | 'Newsletter subscription'
  | 'Total Account Count'
  | 'Deactivate analytics'
  | 'Export AppState'
  | 'Import AppState'
  | 'Set Demo Mode';
