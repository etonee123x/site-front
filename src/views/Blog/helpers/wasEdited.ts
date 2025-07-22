import type { PostWithDatabaseMeta } from '@/api/posts';

export const wasEdited = (post: PostWithDatabaseMeta) => post._meta.createdAt !== post._meta.updatedAt;
