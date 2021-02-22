import { NowRequest, NowResponse } from '@vercel/node';

export default function Home(request: NowRequest, response: NowResponse): void {
  response.status(200).send('Nothing to see here!');
}
