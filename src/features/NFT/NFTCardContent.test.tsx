import { ComponentProps } from 'react';

import { simpleRender } from 'test-utils';

import { fNFTs } from '@fixtures';

import { NFTCardContent } from './NFTCardContent';

const defaultProps: ComponentProps<typeof NFTCardContent> = {
  nft: fNFTs[0]
};

function getComponent(props: ComponentProps<typeof NFTCardContent>) {
  return simpleRender(<NFTCardContent {...props} />);
}

describe('NFTCardContent', () => {
  it('renders images', async () => {
    const { container } = getComponent(defaultProps);
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('renders video', async () => {
    const { container } = getComponent({
      nft: {
        ...fNFTs[0],
        image_preview_url: 'https://storage.opensea.io/files/418185872ae08d3098251fde4495168d.mp4'
      }
    });
    expect(container.querySelector('video')).toBeInTheDocument();
  });

  it('renders placeholder', async () => {
    const { container } = getComponent({
      nft: { ...fNFTs[0], image_preview_url: '', image_url: '' }
    });
    expect(container.querySelector('img')).toBeInTheDocument();
    expect(container.querySelector('img')?.src).toBe('http://localhost/test-file-stub');
  });
});
