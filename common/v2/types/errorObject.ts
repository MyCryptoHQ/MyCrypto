import { InlineMessageType } from './inlineMessages';

export interface ErrorObject {
  type: InlineMessageType;
  message: string | JSX.Element;
}
