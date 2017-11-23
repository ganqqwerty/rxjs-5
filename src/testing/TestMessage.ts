import { Notification } from '../Notification';

export interface TestMessage {
  frame: number;
  notification: Notification<any>;
  // v4-backwards-compatibility
  value: this['notification'];
}