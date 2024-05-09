import { toValue, type MaybeRefOrGetter } from 'vue';
import areEqual from 'deep-equal';

export const useIsUniqueFileCheck = (files: MaybeRefOrGetter<FileList | Array<File>>) => {
  const pickSoft = (file: File) => ({
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    type: file.type,
  });

  return (file: File) => !Array.from(toValue(files)).some((_file) => areEqual(pickSoft(_file), pickSoft(file)));
};
