import React from 'react';

import { primitiveToString } from 'src/modules/helpers';

interface Props {
  debug?: boolean;
  name: string;
}

function FieldDebug(props: Props) {
  const { debug, name } = props;

  if (!debug) {
    return null;
  }

  return (
    <code style={{ backgroundColor: '#eee', fontSize: 12, padding: 8 }}>
      <h4>{name}</h4>
      {Object.entries(props).map(([key, value]) => (
        <div key={key}>
          <b>{key}</b>: {primitiveToString(value, key)}
        </div>
      ))}
    </code>
  );
}

export default FieldDebug;
