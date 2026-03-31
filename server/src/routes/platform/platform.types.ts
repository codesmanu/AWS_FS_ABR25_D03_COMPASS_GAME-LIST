import { Platform } from '@prisma/client';

export type PlatformEntity = Platform;
export type PlatformView = Omit<Platform, 'deletedAt' | 'accountId'>;
export type CreatePlatformInput = Pick<Platform, 'name' | 'company' | 'acquisitionYear' | 'imageUrl'>;
export type UpdatePlatform = Partial<Pick<Platform, 'name' | 'company' | 'acquisitionYear' | 'imageUrl'>>;
