import { OpenSeaNFT } from '@services/ApiService/OpenSea';

export const getNFTURL = (nft: OpenSeaNFT) => nft.image_preview_url ?? nft.image_url;
