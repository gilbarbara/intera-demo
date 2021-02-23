import React from 'react';

export interface ProfileLink {
  name: string;
  url: string;
}

export interface ProfileExperience {
  company: string;
  current?: boolean;
  description?: string;
  endDate?: string;
  location: string;
  startDate: string;
  title: string;
}

export interface Profile {
  about: string;
  email: string;
  experiences: ProfileExperience[];
  firstName: string;
  headline: string;
  industry: string;
  lastName: string;
  links: ProfileLink[];
  location: string;
  picture: string;
}

export interface AppOptions {
  accessToken: string;
  locale: 'pt' | 'en';
  profile: null | Profile;
}

export interface DropdownOption {
  content?: React.FC;
  label: string | number;
  type?: string;
  value: string | number;
}

export type GenericFunction<T = any> = (...args: any[]) => T;

export type Icons =
  | 'asterisk'
  | 'check'
  | 'close'
  | 'download'
  | 'facebook'
  | 'github'
  | 'minus'
  | 'plus'
  | 'search'
  | 'tags'
  | 'twitter'
  | 'user';

export type PlainObject<T = unknown> = Record<string, T>;

export interface SortFunction<T> {
  (left: T, right: T): number;
  (left: string, right: string): number;
}
