import type { Post } from '@shared/src/types';

export const wasEdited = (post: Post) => post.createdAt !== post.updatedAt;
