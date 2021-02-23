import React from 'react';
import convert from 'react-from-dom';
import { Experiment, Variant } from 'react-optimize';
import { Link } from 'react-router-dom';
import { Text, useTranslator } from '@eo-locale/react';
import styled from 'styled-components';

import { useOptions } from 'src/modules/context';
import { lg, md, sm } from 'src/modules/helpers';

import Button from 'src/components/Button';
import Container from 'src/components/Container';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Hero = styled.div`
  background-image: url(https://byintera.com/wp-content/uploads/2020/08/Header-By-Intera-1.jpg);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  height: 50vh;
`;

const HeroContent = styled(Container)`
  align-items: flex-start;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding-bottom: var(--gutter-lg);
  padding-top: var(--gutter-lg);
`;

const Heading = styled.h1`
  color: #fff;
  font-size: 22px;
  margin-bottom: 32px;
  margin-top: 0;
  max-width: 60vw;

  ${sm} {
    font-size: 28px;
  }

  ${md} {
    font-size: 32px;
    max-width: 50vw;
  }

  ${lg} {
    max-width: 40vw;
  }
`;

function Home(): JSX.Element {
  const { options } = useOptions();
  const translator = useTranslator(options.locale);

  const homeIntro = convert(`<h2>${translator.getMessageById('homeIntro') as string}</h2>`, {
    randomKey: true,
  });
  const homeContent = convert(`<p>${translator.getMessageById('homeContent') as string}</p>`, {
    randomKey: true,
  });

  return (
    <Wrapper>
      <Hero>
        <HeroContent>
          <Heading>
            <Experiment id="9qsYJ8aCTi2MFl2_Os1WUQ">
              <Variant id="0">
                <Text id="heroTitleA" />
              </Variant>
              <Variant id="1">
                <Text id="heroTitleB" />
              </Variant>
            </Experiment>
          </Heading>
          <Link to={options.profile ? '/profile' : '/form'}>
            <Button outline size="xl">
              <Text id={options.profile ? 'heroProfile' : 'heroCTA'} />
            </Button>
          </Link>
        </HeroContent>
      </Hero>
      <Container>
        {homeIntro}
        {homeContent}
      </Container>
    </Wrapper>
  );
}

export default Home;
