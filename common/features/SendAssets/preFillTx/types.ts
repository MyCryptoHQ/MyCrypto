export type Param =
  | 'to'
  | 'data'
  | 'readOnly'
  | 'readonly'
  | 'tokenSymbol'
  | 'tokensymbol'
  | 'value'
  | 'gasLimit'
  | 'gaslimit'
  | 'gasPrice'
  | 'gasprice'
  | 'gas'
  | 'sendMode'
  | 'sendmode';

export type queryObject = { [key in Param]: string };
