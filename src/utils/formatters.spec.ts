import { formatMnemonic } from '@utils';

describe('formatMnemonic', () => {
  const formattedPhrase =
    'first catalog away faculty jelly now life kingdom pigeon raise gain accident';

  it('should format phrases with new lines as a phrase with just spaces', () => {
    expect(
      formatMnemonic(
        'first\ncatalog\naway\nfaculty\njelly\nnow\nlife\nkingdom\npigeon\nraise\ngain\naccident'
      )
    ).toEqual(formattedPhrase);
  });

  it('should remove commas and replace with space characters', () => {
    expect(
      formatMnemonic('first,catalog,away,faculty,jelly,now,life,kingdom,pigeon,raise,gain,accident')
    ).toEqual(formattedPhrase);
  });

  it('should trim any stray space characters throughout the phrase', () => {
    expect(
      formatMnemonic(
        'first catalog   away faculty  jelly    now life kingdom pigeon raise gain accident      '
      )
    ).toEqual(formattedPhrase);
  });
});
