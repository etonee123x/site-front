import { isNil } from '@shared/src/utils/isNil';

export const objectGet = (object: object, path: string | number | Array<string | number>): unknown | undefined => {
  let pathArray: Array<string>;

  if (Array.isArray(path)) {
    pathArray = path.map(String);
  } else if (typeof path === 'number') {
    pathArray = [String(path)];
  } else {
    pathArray = path.split('.');
  }

  let result = object;

  for (let i = 0; i < pathArray.length; i++) {
    const maybeKey = pathArray[i];

    if (isNil(maybeKey)) {
      return;
    }

    result = result[maybeKey];

    if (result === undefined) {
      return;
    }
  }

  return result;
};
