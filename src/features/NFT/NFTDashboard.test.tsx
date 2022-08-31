import { fireEvent, simpleRender } from 'test-utils';

import { fNFTCollectionsStats, fNFTs } from '@fixtures';

import NFTDashboard from './NFTDashboard';

function getComponent(fetched = true) {
  return simpleRender(<NFTDashboard />, {
    initialState: {
      nft: {
        fetched,
        nfts: fNFTs,
        stats: fNFTCollectionsStats
      }
    }
  });
}

describe('NFTDashboard', () => {
  it('renders', async () => {
    const { container } = getComponent();
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('can switch display mode', async () => {
    const { container } = getComponent();
    const checkbox = container.querySelector('input[id="display-mode"]');
    fireEvent.click(checkbox!);
    // @todo Detect other display mode
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('renders loading state', async () => {
    const { container } = getComponent(false);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
