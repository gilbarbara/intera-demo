import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { Text, useTranslator } from '@eo-locale/react';
import { Box, Button, Flex, Form, Heading, Image } from 'styled-minimal';

import config from 'src/config';
import { request } from 'src/modules/client';
import { useOptions } from 'src/modules/context';

import Container from 'src/components/Container';
import Field from 'src/components/Field';
import Icon from 'src/components/Icon';
import Portal from 'src/components/Portal';
import LinkedInSignIn from 'src/routes/Form/LinkedInSignIn';

import { Profile, ProfileExperience } from 'src/types';

import Experiences from './Experiences';
import Links from './Links';

function ProfileForm() {
  const [picture, setPicture] = useState('');
  const [showExperience, setShowExperience] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const { control, formState, handleSubmit, setValue, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      experiences: [] as ProfileExperience[],
    },
  });
  const { push } = useHistory();
  const { options, setOptions } = useOptions();
  const translator = useTranslator(options.locale);

  const experiences = watch('experiences');

  useMount(async () => {
    control.register({ name: 'experiences', type: 'custom' });

    if (options.accessToken) {
      try {
        const setValueOptions = { shouldDirty: true, shouldValidate: true };
        const profile = await request(`${config.apiURL}/linkedin`, {
          headers: {
            Authorization: `Bearer ${options.accessToken}`,
          },
        });

        setValue('firstName', profile.firstName, setValueOptions);
        setValue('lastName', profile.lastName, setValueOptions);
        setValue('email', profile.email, setValueOptions);
        setValue('picture', profile.picture, setValueOptions);
        setPicture(profile.picture);
      } catch (error) {}
    }
  });

  const { isDirty, isValid } = formState;

  const handleSubmitExperience = useCallback(
    data => {
      control.setValue('name', experiences.push(data));
    },
    [control, experiences],
  );

  const handleSubmitForm = useCallback(
    (formData: Profile) => {
      setOptions({ profile: formData });
      push('/profile');
    },
    [push, setOptions],
  );

  const addItem = useCallback(({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    const { type } = currentTarget.dataset;

    if (type === 'experience') {
      setShowExperience(true);
    } else if (type === 'link') {
      setLinks(s =>
        s.concat({
          name: '',
          url: '',
        }),
      );
    }
  }, []);

  const removeItem = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    const { key, type } = currentTarget.dataset;

    if (type === 'link') {
      setLinks(s => s.filter((d, i) => parseInt(key || '', 10) !== i));
    }
  };

  const removeExperience = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    const { index } = currentTarget.dataset;

    control.setValue(
      'experiences',
      experiences.filter((d, i) => i !== Number(index)),
    );
  };

  return (
    <Box bg="white" borderTop="1px solid #000" py={4} width="100%">
      <Container maxWidth={800}>
        <Heading mb={4} level={3}>
          <Text id="formHeading" />
        </Heading>

        {!options.accessToken && (
          <Box mb={3}>
            <LinkedInSignIn />
          </Box>
        )}
        {picture && <Image alt="Profile picture" mb={3} src={picture} width={128} />}
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <Flex flexWrap="wrap">
            <Box pr={2} width={[1, 1, 1 / 2]}>
              <Field
                autoComplete="given-name"
                control={control}
                formState={formState}
                label={translator.getMessageById('formFirstName') as string}
                name="firstName"
                required
                type="text"
              />
            </Box>
            <Box pl={2} width={[1, 1, 1 / 2]}>
              <Field
                autoComplete="family-name"
                control={control}
                formState={formState}
                label={translator.getMessageById('formLastName') as string}
                name="lastName"
                required
                type="text"
              />
            </Box>
          </Flex>
          <Flex flexWrap="wrap">
            <Box pr={2} width={[1, 1, 1 / 2]}>
              <Field
                autoComplete="email"
                control={control}
                formState={formState}
                label="E-Mail"
                name="email"
                required
                type="text"
              />
            </Box>
            <Box pl={2} width={[1, 1, 1 / 2]}>
              <Field
                control={control}
                formState={formState}
                label={translator.getMessageById('formLocation') as string}
                placeholder={translator.getMessageById('formLocationPlaceholder') as string}
                name="location"
                required
                type="text"
              />
            </Box>
          </Flex>
          <Field
            control={control}
            formState={formState}
            label={translator.getMessageById('formHeadline') as string}
            name="headline"
            placeholder={translator.getMessageById('formHeadlinePlaceholder') as string}
            required
            type="text"
          />
          <Field
            control={control}
            formState={formState}
            label={translator.getMessageById('formIndustry') as string}
            placeholder={translator.getMessageById('formIndustryPlaceholder') as string}
            name="industry"
            required
            type="text"
          />
          <Field
            label={translator.getMessageById('formAbout') as string}
            control={control}
            formState={formState}
            placeholder={translator.getMessageById('formAboutPlaceholder') as string}
            type="textarea"
            name="about"
          />
          <Field control={control} formState={formState} type="hidden" name="picture" />
          <Box pb={3} mt={3}>
            <Heading level={5} as="h2" mb={3}>
              <Text id="experiencesHeading" />
            </Heading>
            {!!experiences.length && (
              <Box mb={3}>
                {experiences.map((d, i) => (
                  <p key={i}>
                    <span>{`${d.title} - ${d.company}`}</span>
                    <Button
                      size="xs"
                      ml={2}
                      data-index={i}
                      invert
                      border={0}
                      borderRadius="50%"
                      px={0}
                      py={0}
                      onClick={removeExperience}
                    >
                      <Icon name="close" />
                    </Button>
                  </p>
                ))}
              </Box>
            )}
            <Button onClick={addItem} size="sm" invert data-type="experience">
              <Text id="experienceAdd" />
            </Button>
          </Box>
          <Links
            addLink={addItem}
            links={links}
            control={control}
            formState={formState}
            removeLink={removeItem}
          />
          <Box mt={3}>
            <Button variant="black" disabled={!isDirty || !isValid} type="submit">
              <Text id="formSave" />
            </Button>
          </Box>
        </Form>
      </Container>
      <Portal isActive={showExperience} hideCloseButton closeOnEsc={false}>
        <Experiences onCancel={() => setShowExperience(false)} onSubmit={handleSubmitExperience} />
      </Portal>
    </Box>
  );
}

export default ProfileForm;
