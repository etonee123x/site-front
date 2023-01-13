export enum ROUTE {
  GET_FOLDER_DATA = '/get-folder-data*',
  HAPPY_NORMING = '/happy-norming/',
  FUNNY_ANIMALS = '/funny-animals/',
  AUTH = '/auth/',
  PARSER = '/parser/'
}

export type Metadata = {
  bitrate?: number;
  duration: number;
  album?: string;
  artists?: string[];
  bpm?: number;
  year?: number;
};

export class BaseItem {
  name: string;
  url: string;
  src: string;
  birthtime: string;
  numberOfThisExt?: number;
  constructor ({ name, url, src, birthtime, numberOfThisExt }: BaseItem) {
    this.name = name;
    this.url = url;
    this.src = src;
    this.birthtime = birthtime;
    this.numberOfThisExt = numberOfThisExt;
  }
}

export enum ITEM_TYPE {
  FOLDER = 'folder',
  FILE = 'file',
}

export class FolderItem extends BaseItem {
  type = ITEM_TYPE.FOLDER;
  ext = null;
}

export class FileItem extends BaseItem {
  type = ITEM_TYPE.FILE;
}

export enum AUDIO_EXT {
  MP3 = '.mp3',
  WAV = '.wav',
}

export class AudioItem extends FileItem {
  ext: AUDIO_EXT;
  metadata: Metadata;
  constructor (
    fileItem: FileItem,
    { metadata, ext }: { metadata: Metadata, ext: AUDIO_EXT },
  ) {
    super(fileItem);
    this.metadata = metadata;
    this.ext = ext;
  }
}

export enum PICTURE_EXT {
  JPG = '.jpg',
  JPEG = '.jpeg',
  PNG = '.png',
}

export class PictureItem extends FileItem {
  ext: PICTURE_EXT;
  constructor (fileItem: FileItem, { ext }: { ext: PICTURE_EXT }) {
    super(fileItem);
    this.ext = ext;
  }
}

export type FileWithKnownType = PictureItem | AudioItem

export type Item = FileWithKnownType | FolderItem;

export interface NavItem {
  text: string;
  link: string;
}

export interface FolderData {
  linkedFile: FileWithKnownType | null;
  items: Item[];
  lvlUp: string | null;
  navigation: NavItem[];
}

/// RMS

export type SampleRateValues = 44100 | 48000;

export type Headers = {
  channelsNumber: number;
  sampleRate: SampleRateValues;
  byteRate: number;
  blockAlign: number;
  bitsPerSample: number;
};

export type Channels = {
  left: Float32Array;
  right: Float32Array;
};

export type IntervalAndList = {
  interval: {
    min: number;
    max: number;
  };
  list: number[];
};

export interface RMSValue extends IntervalAndList {
  textBand: {
    from: number | string;
    to: number | string;
  };
}

export type BandTitles = 'all' | 'b' | 'lm' | 'hm' | 'h';

export type RMSValues = Record<BandTitles, RMSValue>;

export type SpectrumValues = {
  spectrum: Float32Array[];
  nyquistFrequency: number;
  lengthX: number;
  lengthY: number;
};

export type AudioSegment = {
  start: number;
  end: number;
};

export type TheLoudestSegment = {
  borders: AudioSegment;
  channels: Channels;
};

export type WavData = {
  headers?: Headers;
  compressionRate: number;
  compressedChannels?: Channels;
  duration?: number;
  theLoudestSegment?: TheLoudestSegment;
};

export type SpectrumOptions = {
  windowSize: 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384;
  overlap: number;
  delayBetweenOperations: number;
  shouldUseWindowFunction: boolean;
};

export type onLoadingParams = {
  bandTitle: BandTitles;
  progress: number;
};

export type OtherOptions = {
  useFastMode?: boolean;
  onLoading?: (arg0: onLoadingParams) => unknown;
};

export class KnownError extends Error {

}

export type ErrorLike = KnownError | Error
export type LoginAndPassword = { login: string, password: string }

export type TokenOrLoginAndPassword = { token: string } | LoginAndPassword
