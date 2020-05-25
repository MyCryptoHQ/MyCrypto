import { TURL } from '@types';
export interface Action {
  icon: string;
  faded?: boolean;
  title: string;
  description: string;
  link: string | TURL;
}
