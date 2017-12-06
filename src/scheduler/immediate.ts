// v4-backwards-compatibility

import { ImmediateScheduler } from './ImmediateScheduler';
import { ImmediateAction } from './ImmediateAction';

export const immediate = new ImmediateScheduler(ImmediateAction);