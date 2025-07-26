import type { Post } from '@etonee123x/shared/types/blog';
import type { Id } from '@etonee123x/shared/helpers/id';
import type {
  WithMeta,
  WithIsEnd,
  ForPost,
  ForPut,
  ForPatch,
  WithSinceTimestamps,
} from '@etonee123x/shared/types/database';

import { client } from '@/api/_client';

const PER_PAGE = 10;

export type PostWithMetaWithSinseTimestamps = Post & WithMeta<WithSinceTimestamps>;

export const getPosts = (page: number) =>
  client<WithMeta<WithIsEnd> & { rows: Array<PostWithMetaWithSinseTimestamps> }>(
    `/posts?perPage=${PER_PAGE}&page=${page}`,
  );

export const getPostById = (id: Id) => client<PostWithMetaWithSinseTimestamps>(`/posts/${id}`);

export const postPost = (post: ForPost<Post>) =>
  client<PostWithMetaWithSinseTimestamps>('/posts', { method: 'POST', body: post });

export const putPost = (id: Id, post: ForPut<Post>) =>
  client<PostWithMetaWithSinseTimestamps>(`/posts/${id}`, { method: 'PUT', body: post });

export const patchPost = (id: Id, post: ForPatch<Post>) =>
  client<PostWithMetaWithSinseTimestamps>(`/posts/${id}`, { method: 'PATCH', body: post });

export const deletePost = (id: Id) => client<PostWithMetaWithSinseTimestamps>(`/posts/${id}`, { method: 'DELETE' });
