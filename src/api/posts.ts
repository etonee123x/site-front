import type { Post } from '@etonee123x/shared/types/blog';
import type { Id } from '@etonee123x/shared/helpers/id';
import type {
  WithMeta,
  WithIsEnd,
  ForPost,
  ForPut,
  ForPatch,
  WithDatabaseMeta,
  WithSince,
} from '@etonee123x/shared/types/database';

import { client } from '@/api/_client';

const PER_PAGE = 10;

export type PostWithDatabaseMeta = Post & WithDatabaseMeta & WithMeta<WithSince>;

export const getPosts = (page: number) =>
  client<WithMeta<WithIsEnd> & { rows: Array<PostWithDatabaseMeta> }>(`/posts?perPage=${PER_PAGE}&page=${page}`);

export const getPostById = (id: Id) => client<PostWithDatabaseMeta>(`/posts/${id}`);

export const postPost = (post: ForPost<Post>) => client<PostWithDatabaseMeta>('/posts', { method: 'POST', body: post });

export const putPost = (id: Id, post: ForPut<Post>) =>
  client<PostWithDatabaseMeta>(`/posts/${id}`, { method: 'PUT', body: post });

export const patchPost = (id: Id, post: ForPatch<Post>) =>
  client<PostWithDatabaseMeta>(`/posts/${id}`, { method: 'PATCH', body: post });

export const deletePost = (id: Id) => client<PostWithDatabaseMeta>(`/posts/${id}`, { method: 'DELETE' });
