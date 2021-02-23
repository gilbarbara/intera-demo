import React from 'react';
import { useLocation } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { useUpdateEffect } from 'react-use';
import { useFetch } from '@gilbarbara/hooks';
import { Alert, FlexCenter, Loader } from 'styled-minimal';

import config from 'src/config';
import { useOptions } from 'src/modules/context';
import { queryParse } from 'src/modules/helpers';

import { PlainObject } from 'src/types';

function Auth() {
  const { setOptions } = useOptions();
  const location = useLocation();
  const { code } = queryParse(location.search);

  const { data, error, status } = useFetch<PlainObject<any>>({
    url: `${config.apiURL}/linkedin?code=${code}&redirect_uri=${config.url}/auth`,
    method: 'post',
  });

  useUpdateEffect(() => {
    if (status === 'success' && data?.access_token) {
      setOptions({ accessToken: data.access_token });
    }
  }, [data, setOptions, status]);

  let content = <Loader size={64} />;

  if (status === 'failure') {
    content = (
      <Alert variant="danger">
        {(error?.response as PlainObject<string>)?.error || error?.toString()}
      </Alert>
    );
  } else if (status === 'success') {
    content = <Redirect to="/form" />;
  }

  return (
    <FlexCenter borderTop="1px solid #000" pt={3}>
      {content}
    </FlexCenter>
  );
}

export default Auth;
