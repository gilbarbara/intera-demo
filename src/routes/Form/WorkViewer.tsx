import React, { memo } from 'react';
import { Box, Grid, Text } from 'styled-minimal';

import { PlainObject } from 'src/types';

interface Props {
  collection: PlainObject<any>;
}

function EventFormAttributesViewer({ collection }: Props) {
  const entries = Object.entries(collection).sort(([left], [right]) =>
    left.toLowerCase().localeCompare(right.toLowerCase()),
  );

  return (
    <Grid
      gridTemplateColumns={{
        _: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
      }}
      gridGap={8}
      mb={3}
    >
      {entries.map(([key, value]) => (
        <Box key={key} border="1px solid #ccc" borderRadius={4} p={2}>
          <Text fontWeight="bold">{key}:</Text> <Text>{value}</Text>
        </Box>
      ))}
    </Grid>
  );
}

export default memo(EventFormAttributesViewer);
