export function loadWordList(): Promise<Map<string, WordEntry>>;

export type ExtensionResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function requestSeenList(): Promise<ExtensionResponse<string[]>>;

export function loadTopWords(limit: number): Promise<WordEntry[]>;

export function getNumWordsPerLevel(): Promise<[number, number, number]>;

export function getKnownMap(): Promise<Record<string, boolean>>;

export function isKnownWord(word: string): Promise<boolean>;

export function toggleKnownWord(word: string): Promise<void>;

export function numKnownWords(): Promise<number>;

export function getSeenMap(): Promise<Record<string, boolean>>;

export function isSeenWord(word: string): Promise<boolean>;

export function toggleSeenWord(word: string): Promise<void>;

export function numSeenWords(): Promise<number>;

export function isUnknownWord(word: string): Promise<boolean>;

export function cleanWord(word: string): string;