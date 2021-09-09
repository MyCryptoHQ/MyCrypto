// @todo Expand
export interface OpenSeaNFT {
  id: number;
  name?: string;
  image_original_url?: string;
  image_preview_url?: string;
  image_thumbnail_url: string;
  image_url: string;
  permalink: string;
  collection: OpenSeaCollectionMetadata;
}

interface OpenSeaCollectionMetadata {
  name: string;
  slug: string;
}

export interface OpenSeaCollection {
  slug: string;
  name: string;
  stats: OpenSeaCollectionStats;
}

interface OpenSeaCollectionStats {
  floor_price: number;
}
