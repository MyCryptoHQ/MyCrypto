import placeholder from '@assets/images/nft-placeholder.png';
import { OPENSEA_IMAGE_PROXY } from '@config';
import { OpenSeaNFT } from '@services/ApiService/OpenSea';
import { detectMediaType, getFileExtension, getNFTURL, getUUID, MediaType } from '@utils';

export const NFTCardContent = ({ nft }: { nft: OpenSeaNFT }) => {
  const url = getNFTURL(nft);
  const isEmpty = !(typeof url === 'string' && url.length > 0);

  if (isEmpty || !url) {
    return (
      <img
        src={placeholder}
        style={{
          objectFit: 'cover',
          borderRadius: '2px',
          width: '250px',
          height: '250px'
        }}
      />
    );
  }

  const pathname = new URL(url).pathname;
  const fileExtension = getFileExtension(pathname);
  const hash = getUUID(pathname);
  const postfix = fileExtension ? `.${fileExtension}` : '';
  const proxiedURL = `${OPENSEA_IMAGE_PROXY}/${hash}${postfix}`;
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
