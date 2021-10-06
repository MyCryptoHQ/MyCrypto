import { OPENSEA_IMAGE_PROXY } from '@config';
import { OpenSeaNFT } from '@services/ApiService/OpenSea';
import { detectMediaType, MediaType } from '@utils';

export const NFTCardContent = ({ nft }: { nft: OpenSeaNFT }) => {
  const url = nft.image_preview_url ?? nft.image_url;
  const isEmpty = !(typeof url === 'string' && url.length > 0);

  // @todo Figure out graphics for this case
  if (isEmpty || !url) {
    return (
      <img
        src="https://opensea.io/static/images/placeholder.png"
        style={{
          objectFit: 'cover',
          borderRadius: '2px',
          width: '250px',
          height: '250px'
        }}
      />
    );
  }

  const pathname = new URL(url).pathname.slice(1).split('/').pop();
  const proxiedURL = `${OPENSEA_IMAGE_PROXY}/${pathname}`;
  const mediaType = detectMediaType(url);

  if (mediaType === MediaType.Video) {
    return (
      <video
        muted
        controls
        controlsList="nodownload"
        disableRemotePlayback
        disablePictureInPicture
        preload="metadata"
        src={proxiedURL}
        style={{
          objectFit: 'cover',
          borderRadius: '2px',
          width: '250px',
          height: '250px'
        }}
      />
    );
  }

  // @todo Audio

  return (
    <img
      src={proxiedURL}
      style={{
        objectFit: 'cover',
        borderRadius: '2px',
        width: '250px',
        height: '250px'
      }}
    />
  );
};
