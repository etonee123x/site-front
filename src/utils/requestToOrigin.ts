import type { Request } from 'express';

export const requestToOrigin = (request: Request): string => `${request.protocol}://${request.get('host')}`;
