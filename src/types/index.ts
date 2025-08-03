import type { Settings } from '@/constants/settings';
import type { Request } from 'express';

export interface Locals {
  settings?: Settings;
  cookies?: Record<string, string>;
}

export interface RequestWithLocals extends Request {
  locals?: Locals;
}
