import { RawTokenJSON, ValidatedTokenJSON, NormalizedTokenJSON } from './types/TokensJson';
import { Token } from '../shared/types/network';
interface StrIdx<T> {
  [key: string]: T;
}
const excludedTokens: string[] = ['0x5a276Aeb77bCfDAc8Ac6f31BBC7416AE1A85eEF2'];

function processTokenJson(tokensJson: RawTokenJSON[]): Token[] {
  const normalizedTokens = tokensJson.map(validateTokenJSON).map(normalizeTokenJSON);
  checkForDuplicateAddresses(normalizedTokens);
  return handleDuplicateSymbols(normalizedTokens)
    .map(({ name: _, ...rest }) => rest)
    .filter(filterExcludedTokens)
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
}

function validateTokenJSON(token: RawTokenJSON): ValidatedTokenJSON {
  const isValid = (t: RawTokenJSON): t is ValidatedTokenJSON =>
    !!(t.address && (t.decimals || t.decimals === 0) && t.name && t.symbol);

  if (isValid(token)) {
    return token;
  }
  throw Error(`Token failed validation, missing part of schema
    Symbol: ${token.symbol}
    Name: ${token.name}
    Address: ${token.address}
    Decimals: ${token.decimals}`);
}

function normalizeTokenJSON(token: ValidatedTokenJSON): NormalizedTokenJSON {
  const { address, decimals, symbol, name } = token;
  const t: NormalizedTokenJSON = { address, symbol, decimal: +decimals, name };
  return t;
}

/**
 *
 * @description Checks for any duplicated addresses and halts the program if so
 * @param {NormalizedTokenJSON[]} tokens
 */
function checkForDuplicateAddresses(tokens: NormalizedTokenJSON[]) {
  const map: StrIdx<boolean> = {};
  const errors: string[] = [];
  for (const token of tokens) {
    const { address } = token;
    // We might want to strip hex prefixes here, and make all characters lowercase
    if (map[address]) {
      errors.push(`Token ${token.symbol} has a duplicate address of ${token.address}`);
    }
    map[address] = true;
  }

  if (errors.length) {
    const err = errors.join('\n');
    throw Error(err);
  }
}

/**
 *
 * @description Finds any duplicated names in the fetched token json
 * @param {NormalizedTokenJSON[]} tokens
 * @returns
 */
function getDuplicatedNames(tokens: NormalizedTokenJSON[]) {
  const checkedNames: StrIdx<boolean> = {};
  const duplicatedNames: StrIdx<boolean> = {};
  for (const token of tokens) {
    const { name } = token;
    if (checkedNames[name]) {
      duplicatedNames[name] = true;
    }
    checkedNames[name] = true;
  }
  return duplicatedNames;
}

/**
 *
 * @description Handles any tokens with duplicated symbols by placing them in a map with each value being a bucket
 * of other tokens with the same symbol, then renaming them appropriately so they do not conflict anymore
 * @param {NormalizedTokenJSON[]} tokens
 * @returns
 */
function handleDuplicateSymbols(tokens: NormalizedTokenJSON[]) {
  // start by building a map of symbols => tokens
  const map = new Map<string, NormalizedTokenJSON[]>();
  for (const token of tokens) {
    const { symbol } = token;
    const v = map.get(symbol);
    if (v) {
      map.set(symbol, [...v, token]);
    } else {
      map.set(symbol, [token]);
    }
  }
  const duplicatedNames = getDuplicatedNames(tokens);
  const dedupedTokens: NormalizedTokenJSON[] = [];
  map.forEach(tokenBucket =>
    dedupedTokens.push(...renameSymbolCollisions(tokenBucket, duplicatedNames))
  );
  return dedupedTokens;
}

/**
 *
 * @description Any token collisions are handled in this manner:
 * 1) If the name isnt a duplicate, the token symbol is prefixed with the token name
 * 2) if it is a duplicate, then we simply use the token index + 1 (so we dont start at 0)
 * @param {NormalizedTokenJSON[]} tokens
 * @param {StrIdx<boolean>} duplicatedNames
 * @returns
 */
function renameSymbolCollisions(tokens: NormalizedTokenJSON[], duplicatedNames: StrIdx<boolean>) {
  const renamedTokens: NormalizedTokenJSON[] = [];
  if (tokens.length === 1) {
    return tokens;
  }

  return tokens.reduce((prev, curr, idx) => {
    let newName;
    if (idx === 0) {
      newName = `${curr.symbol}`;
    } else {
      newName = `${curr.symbol} (${duplicatedNames[curr.name] ? idx : curr.name})`;
    }
    const tokenToInsert: NormalizedTokenJSON = {
      ...curr,
      symbol: newName
    };
    console.warn(`WARN: "${curr.symbol}" has a duplicate symbol, renaming to "${newName}"`);
    return [...prev, tokenToInsert];
  }, renamedTokens);
}

/**
 *
 * @description Finds any of the excludedTokens in the fetched token json
 * @param {NormalizedTokenJSON} tokens
 * @returns {boolean}
 */
function filterExcludedTokens(token: NormalizedTokenJSON) {
  for (const excludedToken of excludedTokens) {
    if (excludedToken === token.address) {
      console.warn(
        `WARN: "${token.symbol}" was found on the exclude list. Removing it from the input now.`
      );
      return false;
    }
  }
  return true;
}

module.exports = { processTokenJson };
