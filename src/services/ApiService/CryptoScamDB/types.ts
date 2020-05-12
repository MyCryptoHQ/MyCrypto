import { TAddress } from '@types';

export interface CryptoScamDBBaseResponse {
  input: TAddress;
  success: boolean;
}

export interface CryptoScamDBNoInfoResponse extends CryptoScamDBBaseResponse {
  message: string;
  success: false;
}

interface CryptoScamDBEntry {
  id: string;
  name: string;
  type: ('scam' | 'verified') & string;
  url: string | null;
  hostname: string | null;
  featured: number;
  path: string | null;
  category: ('Scamming' & string) | null;
  subcategory: string | null;
  description: string | null;
  reporter: string | null;
  ip: string | null;
  severity: number;
  statusCode: number | null;
  status: string | null;
  updated: Date;
}

export interface CryptoScamDBInfoResponse {
  success: true;
  coin: 'ETH' & string;
  result: {
    status: ('whitelisted' | 'blocked') & string;
    type: 'address' & string;
    entries: CryptoScamDBEntry[];
  };
}
