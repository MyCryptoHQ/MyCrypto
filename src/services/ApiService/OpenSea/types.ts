// @todo Expand
export interface OpenSeaNFT {
  id: number;
  name: string;
  image_url: string;
  permalink: string;
  collection: OpenSeaCollection;
}

export interface OpenSeaCollection {
  name: string;
}
