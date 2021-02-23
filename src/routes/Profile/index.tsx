import React from 'react';
import { Link } from 'react-router-dom';
import { Text } from '@eo-locale/react';
import { Box, Flex, Heading, Image, Link as PlainLink, Paragraph, UL } from 'styled-minimal';

import { useOptions } from 'src/modules/context';
import { sortByLocaleCompare } from 'src/modules/helpers';

import Container from 'src/components/Container';
import Icon from 'src/components/Icon';

import { PlainObject, ProfileExperience } from 'src/types';

function Profile() {
  const {
    options: { profile },
  } = useOptions();

  const output: PlainObject<any> = {
    main: (
      <Paragraph textAlign="center">
        You don't have a profile yet. <Link to="/form">Create</Link> one now!
      </Paragraph>
    ),
  };

  if (profile) {
    if (profile.experiences) {
      output.experiences = (
        <Box mt={3}>
          <Heading as="h3" fontSize={{ _: 18, md: 24 }} mb={2}>
            <Text id="experiencesHeading" />
          </Heading>
          <UL>
            {[...profile.experiences]
              .sort(
                sortByLocaleCompare<ProfileExperience>('startDate', { descending: true }),
              )
              .map(d => (
                <li key={`${d.title}-${d.company}`}>
                  <Heading as="h4" fontSize={{ _: 16, md: 18 }}>
                    {d.title}
                  </Heading>
                  <Paragraph>{d.company}</Paragraph>
                  <Paragraph>
                    {d.startDate} - {d.endDate || <Text id="formPresent" />}
                  </Paragraph>
                </li>
              ))}
          </UL>
        </Box>
      );
    }

    if (profile.links) {
      output.links = (
        <Box mt={3}>
          <Heading as="h3" fontSize={{ _: 18, md: 24 }} mb={2}>
            <Text id="linksHeading" />
          </Heading>
          {profile.links.map(d => (
            <Paragraph key={d.url}>
              <PlainLink href={d.url} target="_blank" rel="noopener">
                {d.name}
              </PlainLink>
            </Paragraph>
          ))}
        </Box>
      );
    }

    output.main = (
      <>
        <Flex>
          <Box width={{ _: 96, md: 128 }}>
            {profile.picture ? (
              <Image
                alt={profile.firstName}
                borderRadius="50%"
                src={profile.picture}
                width={{ _: 96, md: 128 }}
              />
            ) : (
              <Icon name="user" />
            )}
          </Box>
          <Box ml={3} flex="1">
            <Heading fontSize={{ _: 20, sm: 24, md: 32 }}>
              {profile.firstName} {profile.lastName}
            </Heading>
            <Heading as="h2" fontSize={{ _: 16, sm: 18, md: 24 }} fontWeight="normal" mb={3}>
              {profile.headline}
            </Heading>
            <Paragraph fontSize={{ _: 14, md: 18 }}>{profile.location}</Paragraph>
          </Box>
        </Flex>
        {profile.about && <Paragraph mt={3}>{profile.about}</Paragraph>}
        <Box mt={3}>
          <Heading as="h3" fontSize={{ _: 18, md: 24 }} mb={2}>
            <Text id="formAbout" />
          </Heading>
          <Paragraph>
            <Text id="formIndustry" />: {profile.industry}
          </Paragraph>
          <Paragraph>Email: {profile.email}</Paragraph>
        </Box>
        {output.experiences}
        {output.links}
      </>
    );
  }

  return (
    <Box bg="white" borderTop="1px solid #000" py={4} width="100%">
      <Container maxWidth={800}>{output.main}</Container>
    </Box>
  );
}

export default Profile;
