import { formatMnemonic } from '@utils/formatters';

describe('formatMnemonic', () => {
  const testPhraseNewLines =
    'first\ncatalog\naway\nfaculty\njelly\nnow\nlife\nkingdom\npigeon\nraise\ngain\naccident';
  const testPhraseExtraSpaces =
    'first catalog   away faculty  jelly    now life kingdom pigeon raise gain accident      ';
  const testPhraseCommas =
    'first,catalog,away,faculty,jelly,now,life,kingdom,pigeon,raise,gain,accident';
  const formattedTestPhrase =
    'first catalog away faculty jelly now life kingdom pigeon raise gain accident';

  it('should format phrases with new lines as a phrase with just spaces', () => {
    expect(formatMnemonic(testPhraseNewLines)).toEqual(formattedTestPhrase);
  });

  it('should remove commas and replace with space characters', () => {
    expect(formatMnemonic(testPhraseCommas)).toEqual(formattedTestPhrase);
  });

  it('should trim any stray space characters throughout the phrase', () => {
    expect(formatMnemonic(testPhraseExtraSpaces)).toEqual(formattedTestPhrase);
  });
});
