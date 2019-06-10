export interface Action {
  icon: string | string[];
  title: string;
  description: string | string[];
  tracking: string | string[];
  path?: string;
  url?: string | string[];
}
