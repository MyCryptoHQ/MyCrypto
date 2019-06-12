// Create union type from array
// https://stackoverflow.com/a/45257357/2057532
// Solution is valid until we update to typescript 3.4 where we can then use
// const symbol = [] as const

// Nominal Typing because we want our symbol|tickers to be different from a 'string'
// Using a 'brand' enum + intersection with the base type.
// Advantage of this pattern over interface is that they remain compatible with the base.
// https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html
// Alternatives are:
// - Union type from array https://stackoverflow.com/a/45257357/2057532 (discarded because symbol names change)
// - const symbol = [] as const with TS 3.4

enum SymbolBrand {}
type TSymbol = SymbolBrand & string;

export default TSymbol;
