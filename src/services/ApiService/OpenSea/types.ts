// @todo Expand
export interface OpenSeaNFT {
  id: number;
  token_id: string;
  num_sales: number;
  background_color: string | null;
  image_original_url: string | null;
  image_preview_url: string | null;
  image_thumbnail_url: string | null;
  image_url: string | null;
  animation_url: string | null;
  animation_original_url: string | null;
  name: string | null;
  description: string | null;
  external_link: string | null;
  asset_contract: OpenSeaAssetContract;
  permalink: string;
  collection: OpenSeaCollectionMetadata;
  decimals: number;
  token_metadata: string | null;
  owner: OpenSeaUser;
  sell_orders: any[] | null;
  creator: OpenSeaUser;
  traits: any;
  last_sale: string | null;
  top_bid: string | null;
  listing_date: string | null;
  is_presale: boolean;
  transfer_fee_payment_token: null;
  transfer_fee: null;
}

interface OpenSeaUser {
  user: any;
  profile_img_url: string | null;
  address: string;
  config: string;
}

interface OpenSeaAssetContract {
  address: string | null;
  asset_contract_type: string;
  created_date: string;
  name: string | null;
  nft_version: string | null;
  opensea_version: null;
  owner: number | null;
  schema_name: string | null;
  symbol: string | null;
  total_supply: string;
  description: string | null;
  external_link: string | null;
  image_url: string | null;
  default_to_fiat: boolean;
  dev_buyer_fee_basis_points: number;
  dev_seller_fee_basis_points: number;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: number;
  opensea_seller_fee_basis_points: number;
  buyer_fee_basis_points: number;
  seller_fee_basis_points: number;
  payout_address: string | null;
}

interface OpenSeaCollectionMetadata {
  banner_image_url: string | null;
  chat_url: string | null;
  created_date: string | null;
  default_to_fiat: boolean;
  description: string | null;
  dev_buyer_fee_basis_points: string | null;
  dev_seller_fee_basis_points: string;
  discord_url: string | null;
  display_data: { card_display_style: string | null; images?: any[] };
  external_url: string | null;
  featured: boolean;
  featured_image_url: string | null;
  hidden: boolean;
  safelist_request_status: string | null;
  image_url: string | null;
  is_subject_to_whitelist: boolean;
  large_image_url: string | null;
  medium_username: string | null;
  name: string | null;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: string | null;
  opensea_seller_fee_basis_points: string | null;
  payout_address: string | null;
  require_email: boolean;
  short_description: string | null;
  slug: string;
  telegram_url: string | null;
  twitter_username: string | null;
  instagram_username: string | null;
  wiki_url: string | null;
}

export interface OpenSeaCollection extends OpenSeaCollectionMetadata {
  primary_asset_contracts: OpenSeaAssetContract[];
  traits: any;
  stats: OpenSeaCollectionStats;
  // When fetched for a user address
  owned_asset_count: number;
}

export interface CustomOpenSeaCollection extends OpenSeaCollectionMetadata {
  stats?: CustomOpenSeaCollectionStats;
}

export interface CustomOpenSeaCollectionStats extends OpenSeaCollectionStats {
  slug: string;
}

interface OpenSeaCollectionStats {
  one_day_volume: number;
  one_day_change: number;
  one_day_sales: number;
  one_day_average_price: number;
  seven_day_volume: number;
  seven_day_change: number;
  seven_day_sales: number;
  seven_day_average_price: number;
  thirty_day_volume: number;
  thirty_day_change: number;
  thirty_day_sales: number;
  thirty_day_average_price: number;
  total_volume: number;
  total_sales: number;
  total_supply: number;
  count: number;
  num_owners: number;
  average_price: number;
  num_reports: number;
  market_cap: number;
  floor_price: number;
}
