import { RefObject, useEffect, useRef, useState } from 'react';
import { useLocalStorage, useSetState } from 'react-use';
import is from 'is-lite';

import { AppOptions, PlainObject, SortFunction } from 'src/types';

export const sm = '@media (min-device-width: 400px)';
export const md = '@media (min-device-width: 768px)';
export const lg = '@media (min-device-width: 1024px)';

/**
 * Does nothing
 */
export function noop() {
  return undefined;
}

/**
 * Pad a number with zeros
 */
export function pad(input: number, length = 2) {
  return `${input}`.padStart(length, '0');
}

/**
 * Convert primitive to string
 */
export function primitiveToString(val: any, key: string): string {
  if (key === 'control') {
    return `{ RHF ${key} }`;
  }

  if (is.function(val)) {
    return '{ Function }';
  }

  if (is.plainObject(val) || is.array(val)) {
    return JSON.stringify(val, null, 2);
  }

  if (is.undefined(val)) {
    return 'undefined';
  }

  return val.toString();
}

export function queryParse(search: string): PlainObject<string> {
  return search
    .slice(1)
    .split('&')
    .reduce<PlainObject<string>>((acc, d) => {
      const [key, value] = d.split('=');
      acc[key] = value;
      return acc;
    }, {});
}

export function randomString(length = 6): string {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = length; i > 0; --i)
    result += characters[Math.round(Math.random() * (characters.length - 1))];

  return result;
}

/**
 * Sort an array with localeCompare
 */
export function sortByLocaleCompare<B = PlainObject<string>>(
  key?: string,
  options: Intl.CollatorOptions & { descending?: boolean } = {},
): SortFunction<B> {
  const { descending, ...compareOptions } = options;

  if (key) {
    if (descending) {
      return <T extends PlainObject<string>>(left: T, right: T) =>
        right[key].toLowerCase().localeCompare(left[key].toLowerCase(), undefined, compareOptions);
    }

    return <T extends PlainObject<string>>(left: T, right: T) =>
      left[key].toLowerCase().localeCompare(right[key].toLowerCase(), undefined, compareOptions);
  }

  if (descending) {
    return <T extends string>(left: T, right: T) =>
      right.toLowerCase().localeCompare(left.toLowerCase(), undefined, compareOptions);
  }

  return <T extends string>(left: T, right: T) =>
    left.toLowerCase().localeCompare(right.toLowerCase(), undefined, compareOptions);
}

export function useLocalStorageState<T extends AppOptions>(
  key: string,
  defaultValue: (() => T) | T,
  { serializer = JSON.stringify, deserializer = JSON.parse } = {},
): [state: T, setState: (state: Partial<T>) => void] {
  const [value, setValue] = useLocalStorage(
    key,
    typeof defaultValue === 'function' ? defaultValue() : defaultValue,
    {
      raw: false,
      serializer,
      deserializer,
    },
  );
  const [state, setState] = useSetState<T>(value);

  useEffect(() => {
    setValue(state);
  }, [setValue, state]);

  return [state, setState];
}

export function useParentFontSize<T = HTMLSpanElement>(): [
  RefObject<T>,
  number | undefined,
  boolean,
] {
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState<number | undefined>(undefined);
  const ref = useRef<T>(null);

  useEffect(() => {
    const { current } = ref;

    if (current instanceof HTMLSpanElement && current.parentElement) {
      const { fontSize } = getComputedStyle(current.parentElement);

      setSize(fontSize ? Math.round(parseInt(fontSize, 10)) : 0);
    }

    setReady(true);
  }, []);

  return [ref, size, ready];
}
