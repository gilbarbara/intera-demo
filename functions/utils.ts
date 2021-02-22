import { NowApiHandler, NowRequest, NowResponse } from '@vercel/node';
import fetch from 'node-fetch';

export interface Email {
  elements: EmailElement[];
}

export interface EmailElement {
  'handle~': {
    emailAddress: string;
  };
  handle: string;
}

export type PlainObject<T = unknown> = Record<string, T>;

export interface Profile {
  firstName: ProfileFirstName;
  lastName: ProfileLastName;
  profilePicture?: ProfilePicture;
  id: string;
}

export interface ProfileFirstName {
  localized: ProfileLocalized;
  preferredLocale: ProfilePreferredLocale;
}

export interface ProfileLastName {
  localized: ProfileLocalized;
  preferredLocale: ProfilePreferredLocale;
}

export interface ProfilePicture {
  displayImage: string;
  'displayImage~': ProfileDisplayImage;
}

export interface ProfileDisplayImage {
  paging: {
    count: number;
    start: number;
    links: any[];
  };
  elements: ProfileDisplayImageElement[];
}

export interface ProfileDisplayImageElement {
  artifact: string;
  authorizationMethod: string;
  data: ProfileElementData;
  identifiers: ProfileElementIdentifier[];
}

export interface ProfileElementData {
  'com.linkedin.digitalmedia.mediaartifact.StillImage': {
    mediaType: string;
    rawCodecSpec: {
      name: string;
      type: string;
    };
    displaySize: {
      width: number;
      uom: string;
      height: number;
    };
    storageSize: {
      width: number;
      height: number;
    };
    storageAspectRatio: {
      widthAspect: number;
      heightAspect: number;
      formatted: string;
    };
    displayAspectRatio: {
      widthAspect: number;
      heightAspect: number;
      formatted: string;
    };
  };
}

export interface ProfileElementIdentifier {
  identifier: string;
  index: number;
  mediaType: string;
  file: string;
  identifierType: string;
  identifierExpiresInSeconds: number;
}

export interface ProfileLocalized {
  en_US: string;
  pt_BR: string;
}

export interface ProfilePreferredLocale {
  country: string;
  language: string;
}

export interface RequestOptions {
  body?: any;
  headers?: PlainObject<string>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  type?: string;
  url: string;
}

export interface RequestError extends Error {
  status: number;
  response: any;
}

export const allowCors = (fn: NowApiHandler, methods = ['GET']) => async (
  req: NowRequest,
  res: NowResponse,
) => {
  const allowedMethods = [...methods, 'OPTIONS'].join(',');

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', allowedMethods);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Authorization, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return fn(req, res);
};

export async function request<T = PlainObject<any>>({ type, url, ...options }: RequestOptions) {
  return fetch(url, options).then(async response => {
    const text = await response.text();
    let content: T | string;

    try {
      content = JSON.parse(text);
    } catch {
      content = text;
    }

    if (response.status > 299) {
      const error = new Error(response.statusText) as RequestError;
      error.status = response.status;
      error.response = content;

      throw error;
    } else {
      return content;
    }
  });
}

export function urlEncode(input: PlainObject<any>): string {
  return Object.entries(input)
    .reduce<string[]>((acc, [key, value]) => acc.concat([`${key}=${value}`]), [])
    .join('&');
}
