import React from 'react';
import styled from 'styled-components';

import config from 'src/config';
import { randomString } from 'src/modules/helpers';

const Wrapper = styled.a`
  background-image: url('/media/linkedIn-signIn--default.png');
  background-size: cover;
  display: block;
  height: ${`${(200 * 0.136986301).toFixed(2)}px`};
  width: 200px;
`;
const clientId = '775g5553o6pamo';

function LinkedInSignIn() {
  return (
    <Wrapper
      href={`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${
        config.url
      }/auth&state=${randomString()}&scope=r_liteprofile%20r_emailaddress`}
    ></Wrapper>
  );
}

export default LinkedInSignIn;
