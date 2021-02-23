import React from 'react';
import { Container as ContainerBase } from 'styled-minimal';

function Container({ children, ...rest }: React.PropsWithChildren<any>): JSX.Element {
  return (
    <ContainerBase maxWidth={1280} {...rest}>
      {children}
    </ContainerBase>
  );
}

export default Container;
