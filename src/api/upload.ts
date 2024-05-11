import { client } from '@/api/_client';

export const postUpload = (files: Array<File>) => {
  const formData = new FormData();

  files.forEach((file) => formData.append('file', file));

  return client<Array<string>>('/upload', { method: 'POST', body: formData });
};
