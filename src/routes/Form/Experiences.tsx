import React, { useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Text, useTranslator } from '@eo-locale/react';
import { Box, Button, Form, Grid, Group, Heading, Label } from 'styled-minimal';

import { useOptions } from 'src/modules/context';

import Field from 'src/components/Field';

interface Props {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

function FormBox(props: any) {
  return <Box p={3} maxWidth={800} bg="#fff" {...props} />;
}

function Experiences(props: Props) {
  const { onCancel, onSubmit } = props;

  const { control, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: { current: false },
  });
  const current = useWatch({ control, name: 'current' });
  const { options } = useOptions();
  const translator = useTranslator(options.locale);

  const { isDirty, isValid } = formState;

  const handleSubmitForm = useCallback(
    (formData: any) => {
      onSubmit(formData);
      onCancel();
    },
    [onCancel, onSubmit],
  );

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)} width="100vw" maxWidth={800}>
      <FormBox position="relative">
        <Heading level={5} as="h2">
          <Text id="experienceNew" />
        </Heading>

        <Box mt={3}>
          <Field
            autoComplete="off"
            control={control}
            formState={formState}
            label={translator.getMessageById('formTitle') as string}
            name="title"
            required
            type="text"
          />
          <Field
            autoComplete="off"
            control={control}
            formState={formState}
            label={translator.getMessageById('formCompany') as string}
            name="company"
            required
            type="text"
          />
          <Field
            autoComplete="off"
            control={control}
            formState={formState}
            label={translator.getMessageById('formLocation') as string}
            name="location"
            required
            type="text"
          />
          <Grid
            gridTemplateColumns={{
              _: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            }}
            gridGap={12}
          >
            <Field
              control={control}
              formState={formState}
              label={translator.getMessageById('formStartDate') as string}
              name="startDate"
              required
              type="dateSelector"
            />
            {current ? (
              <Box>
                <Label>
                  <Text id="formEndDate" />
                </Label>
                <Text id="formPresent" />
              </Box>
            ) : (
              <Field
                control={control}
                formState={formState}
                label={translator.getMessageById('formEndDate') as string}
                name="endDate"
                required
                type="dateSelector"
              />
            )}
          </Grid>

          <Field
            control={control}
            label={translator.getMessageById('formCurrent') as string}
            formState={formState}
            name="current"
            type="switch"
          />

          <Field
            autoComplete="off"
            control={control}
            formState={formState}
            label={translator.getMessageById('formDescription') as string}
            name="description"
            type="textarea"
          />

          <Box mt={3}>
            <Group gap={3}>
              <Button variant="black" disabled={!isDirty || !isValid} type="submit">
                <Text id="formSubmit" />
              </Button>

              <Button variant="black" invert type="button" onClick={onCancel}>
                <Text id="formCancel" />
              </Button>
            </Group>
          </Box>
        </Box>
      </FormBox>
    </Form>
  );
}

export default Experiences;
