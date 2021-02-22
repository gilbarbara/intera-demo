import { NowRequest, NowResponse } from '@vercel/node';

import {
  allowCors,
  Email,
  PlainObject,
  Profile,
  ProfileLocalized,
  request,
  urlEncode,
} from '../utils';

const clientId = '775g5553o6pamo';
const clientSecret = 'SsgWpKpNnCgv6mkA';

export default allowCors(
  async (req: NowRequest, res: NowResponse) => {
    try {
      const {
        headers,
        method,
        query: { code, redirect_uri },
      } = req;

      if (!['GET', 'POST'].includes(method as string)) {
        res.status(405).send('');
        return;
      }

      if (method === 'POST') {
        if (!code || !redirect_uri) {
          res.status(400).send('Missing "code" or "redirect_uri"');
          return;
        }

        const result = await request({
          url: 'https://www.linkedin.com/oauth/v2/accessToken',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: urlEncode({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri,
          }),
        });

        res.status(200).json(result);
      }

      if (method === 'GET') {
        if (!headers.authorization) {
          res.status(401).send('');
          return;
        }

        const output: PlainObject<string> = {
          picture: '',
        };

        const profile = (await request<Profile>({
          url:
            'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
          headers: {
            Authorization: headers.authorization,
          },
        })) as Profile;
        const email = (await request<Email>({
          url: 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
          headers: {
            Authorization: headers.authorization,
          },
        })) as Email;

        const locale = `${profile.firstName.preferredLocale.language}_${profile.firstName.preferredLocale.country}` as keyof ProfileLocalized;

        output.firstName = profile.firstName.localized[locale];
        output.lastName = profile.lastName.localized[locale];

        if (profile.profilePicture) {
          const pictures = profile.profilePicture['displayImage~'].elements;
          output.picture = pictures[pictures.length - 1].identifiers[0].identifier;
        }

        output.email = email.elements[0]['handle~'].emailAddress;

        res.status(200).json(output);
      }
    } catch (error) {
      res.status(error.status || 400).json({ error: error.response || error.toString() });
    }
  },
  ['GET', 'POST'],
);
