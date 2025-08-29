import type { RequestWithLocals } from '@/types';
import type { NextFunction, Response } from 'express';
import type { InjectionKey } from 'vue';

export interface ExpressContext {
  request: RequestWithLocals;
  response: Response;
  next: NextFunction;
}

export const INJECTION_KEY_EXPRESS_CONTEXT: InjectionKey<ExpressContext> = Symbol('expressContext');
