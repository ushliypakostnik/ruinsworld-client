// Root

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStore {}

// Common

export interface IStoreModule extends IStore {
  [key: string]: any;
}

export type TFieldPayload = {
  field: string;
  value: any;
};

// Preloader

type TPreloaderField = boolean;
export interface IPreloader extends IStore {
  [key: string]: TPreloaderField;
}

// Layout

export type TLanguage = string | null;
export type TEventMessagePayload = {
  id: number;
  text: string;
};
