import React from 'react';
import { Control, FormState } from 'react-hook-form';
import { Text, useTranslator } from '@eo-locale/react';
import { Box, Button, Grid, Heading } from 'styled-minimal';

import Field from 'src/components/Field';

import { GenericFunction } from 'src/types';

interface Link {
  name: string;
  url: string;
}

interface Props {
  addLink: GenericFunction;
  links: Link[];
  control: Control;
  formState: FormState<any>;
  removeLink: GenericFunction;
}

function FormBox(props: any) {
  return <Box pb={3} {...props} />;
}

function Links(props: Props) {
  const translator = useTranslator();
  const { addLink, control, formState, links, removeLink } = props;

  return (
    <FormBox>
      <Heading level={5} as="h2">
        <Text id="linksHeading" />
      </Heading>

      <Box mt={3}>
        {links.map((d, i) => {
          const fieldName = `links[${i}]`;

          return (
            <Box key={`${d.name}-${i}`} mb={3}>
              <Grid
                gridTemplateColumns={{
                  _: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                gridGap={12}
              >
                <Field
                  autoComplete="off"
                  control={control}
                  formState={formState}
                  label={translator.getMessageById('formName') as string}
                  name={`${fieldName}.name`}
                  required
                  type="text"
                />
                <Field
                  autoComplete="off"
                  control={control}
                  formState={formState}
                  label="URL"
                  name={`${fieldName}.url`}
                  required
                  type="text"
                />
              </Grid>
              <Button size="xs" onClick={removeLink} mt={1} data-key={i} data-type="link">
                <Text id="remove" />
              </Button>
            </Box>
          );
        })}
      </Box>
      <Button onClick={addLink} size="sm" invert data-type="link">
        <Text id="linkAdd" />
      </Button>
    </FormBox>
  );
}

export default Links;
