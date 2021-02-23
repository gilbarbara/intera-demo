import { AppOptions } from 'src/types';

export const appOptions: AppOptions = {
  accessToken: '',
  locale: 'pt',
  profile: null,
};

const config = {
  apiURL: 'https://intera-api.vercel.app',
  url: 'http://localhost:3000',
};

if (process.env.NODE_ENV === 'production') {
  config.url = 'https://intera-demo.vercel.app';
}

export default config;
