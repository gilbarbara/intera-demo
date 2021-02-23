import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useMount, usePrevious, useUnmount, useUpdateEffect } from 'react-use';
import is from 'is-lite';
import styled, { keyframes } from 'styled-components';

import Icon from './Icon';

interface Props {
  children: React.ReactNode;
  closeOnClickOverlay?: boolean;
  closeOnEsc?: boolean;
  hideCloseButton?: boolean;
  hideOverlay?: boolean;
  isActive?: boolean;
  onClose?: (element: HTMLDivElement) => void;
  onOpen?: () => void;
  transitionClassName?: string;
}

function createPortal() {
  const el = document.createElement('div');
  el.classList.add('__portal');

  return el;
}

const portalHide = keyframes`
  0% {
    opacity: 1;
    visibility: visible;
  }

  100% {
    opacity: 0;
    visibility: hidden;
  }
`;

const portalShow = keyframes`
  0% {
    opacity: 0;
    visibility: hidden;
  }

  100% {
    opacity: 1;
    visibility: visible;
  }
`;

const CloseBtn = styled.button`
  color: #000;
  font-size: 20px;
  height: 30px;
  line-height: 1;
  pointer-events: all;
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  z-index: 20;
`;

const Content = styled.div`
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  width: auto;
  z-index: 10;
`;

const Overlay = styled.div<Pick<Props, 'isActive'>>`
  background-color: rgba(0, 0, 0, 0.3);
  bottom: 0;
  left: 0;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.5s;
`;

const Wrapper = styled.div<Pick<Props, 'isActive'>>`
  align-items: center;
  animation-duration: 0.5s;
  animation-name: ${portalHide};
  animation-play-state: ${({ isActive }) => (isActive ? 'running' : 'paused')};
  animation-name: ${({ isActive }) => (isActive ? portalShow : portalHide)};
  animation-direction: ${({ isActive }) => (isActive ? 'normal' : 'reverse')};
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 100;
`;

export function Portal(props: Props) {
  const {
    children,
    closeOnClickOverlay = true,
    closeOnEsc = true,
    hideCloseButton = false,
    hideOverlay = false,
    isActive = false,
    onClose,
    onOpen,
  } = props;

  const closePortal = useRef(() => {
    destroyPortal.current();

    if (is.function(onClose)) {
      onClose(portal.current);
    }
  });
  const destroyPortal = useRef(() => {
    if (closeOnEsc) {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });
  const portal = useRef(createPortal());

  const previousIsActive = usePrevious(isActive);
  const previousCloseOnEsc = usePrevious(closeOnEsc);

  const handleKeyDown = useCallback(e => {
    if (e.keyCode === 27) {
      e.stopPropagation();
      closePortal.current();
    }
  }, []);

  useMount(() => {
    document.body.appendChild(portal.current);

    if (isActive && closeOnEsc) {
      document.addEventListener('keydown', handleKeyDown);
    }
  });

  useUnmount(() => {
    destroyPortal.current();
    document.body.removeChild(portal.current);
  });

  const openPortal = useCallback(() => {
    if (is.function(onOpen)) {
      onOpen();
    }

    if (closeOnEsc) {
      document.addEventListener('keydown', handleKeyDown);
    }
  }, [closeOnEsc, handleKeyDown, onOpen]);

  useUpdateEffect(() => {
    const hasChanged = previousIsActive !== isActive;

    if (hasChanged && isActive) {
      openPortal();
    } else if (hasChanged && !isActive) {
      destroyPortal.current();
    }

    if (previousCloseOnEsc !== closeOnEsc) {
      if (closeOnEsc) {
        document.addEventListener('keydown', handleKeyDown);
      } else {
        document.removeEventListener('keydown', handleKeyDown);
      }
    }
  }, [
    closeOnEsc,
    destroyPortal,
    handleKeyDown,
    isActive,
    openPortal,
    previousIsActive,
    previousCloseOnEsc,
  ]);

  const handleClickClose = useCallback(
    e => {
      const el = e.currentTarget;

      if (el.className.includes('overlay') && !closeOnClickOverlay) {
        return;
      }

      closePortal.current();
    },
    [closeOnClickOverlay, closePortal],
  );

  const content = [];

  if (isActive) {
    content.push(children);
  }

  return ReactDOM.createPortal(
    <Wrapper isActive={isActive}>
      {!hideOverlay && <Overlay isActive={isActive} onClick={handleClickClose} />}
      {!hideCloseButton && (
        <CloseBtn onClick={handleClickClose} title="Close" type="button">
          <Icon name="close" />
        </CloseBtn>
      )}
      <Content>{content}</Content>
    </Wrapper>,
    portal.current,
  );
}

export default Portal;
