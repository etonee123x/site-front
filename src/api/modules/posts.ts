import type { Post, ForPost, Id, ForPut, ForPatch } from '@shared/src/types';

import { Client } from '@/api/client';

const PER_PAGE = 10;

export const getPosts = (page: number) => Client.get<Array<Post>>(`/posts?perPage=${PER_PAGE}&page=${page}`);

export const getPostById = (id: Id) => Client.get<Post>(`/posts/${id}`);

export const postPost = (post: ForPost<Post>) => Client.post<ForPost<Post>, Post>('/posts', post);

export const putPost = (id: Id, post: ForPut<Post>) => Client.put<ForPut<Post>, Post>(`/posts/${id}`, post);

export const patchPost = (id: Id, post: ForPatch<Post>) => Client.patch<ForPatch<Post>, Post>(`/posts/${id}`, post);

export const deletePost = (id: Id) => Client.delete<Post>(`/posts/${id}`);
