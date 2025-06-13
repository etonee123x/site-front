import type { Post } from '@etonee123x/shared/types/blog';
import type { Id } from '@etonee123x/shared/types/id';
import type { WithMeta, WithIsEnd, ForPost, ForPut, ForPatch } from '@etonee123x/shared/types/database';

import { client } from '@/api/_client';

const PER_PAGE = 10;

export const getPosts = (page: number) =>
  client<WithMeta<WithIsEnd> & { data: Array<Post> }>(`/posts?perPage=${PER_PAGE}&page=${page}`);

export const getPostById = (id: Id) => client<Post>(`/posts/${id}`);

export const postPost = (post: ForPost<Post>) => client<Post>('/posts', { method: 'POST', body: post });

export const putPost = (id: Id, post: ForPut<Post>) => client<Post>(`/posts/${id}`, { method: 'PUT', body: post });

export const patchPost = (id: Id, post: ForPatch<Post>) =>
  client<Post>(`/posts/${id}`, { method: 'PATCH', body: post });

export const deletePost = (id: Id) => client<Post>(`/posts/${id}`, { method: 'DELETE' });
