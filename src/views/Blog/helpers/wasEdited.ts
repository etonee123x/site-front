import type { Post } from '@etonee123x/shared/types/blog';

export const wasEdited = (post: Post) => post.createdAt !== post.updatedAt;
