export interface NansenServiceResponse {
  result?: NansenServiceEntry;
  error?: string;
}

export interface NansenServiceEntry {
  labels: string[];
  name: string;
}
