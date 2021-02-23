import React from 'react';
import styled from 'styled-components';

import { useOptions } from 'src/modules/context';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  label {
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 3px;
    cursor: pointer;
    display: inline-flex;
    height: 22px;
    position: relative;
    width: 70px;

    span.on,
    span.off {
      font-size: 12px;
      font-weight: 600;
      height: 16px;
      line-height: 1.4;
      padding: 2px 0;
      position: absolute;
      text-align: center;
      top: 0;
      width: 50%;
    }

    span.on {
      border-bottom-right-radius: 2px;
      border-top-right-radius: 2px;
      color: #fff;
      left: 0;
      right: inherit;
    }

    span.off {
      border-bottom-right-radius: 2px;
      border-top-right-radius: 2px;
      color: #000;
      right: 0;
    }
  }

  input {
    display: none;

    &:checked {
      + label {
        span.on {
          color: #000;
        }

        span.off {
          color: #fff;
        }

        &:before {
          left: 50%;
        }
      }
    }

    + label:before {
      background: #000;
      content: '';
      display: block;
      height: 20px;
      left: 0;
      position: absolute;
      top: 0;
      transition: 0.3s;
      width: 50%; /* W3C */
    }
  }
`;

function Switch(): JSX.Element {
  const { options, setOptions } = useOptions();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({ locale: e.target.checked ? 'en' : 'pt' });
  };

  return (
    <Wrapper>
      <input
        type="checkbox"
        id="language"
        name="language"
        onChange={handleChange}
        defaultChecked={options.locale === 'en'}
      />
      <label htmlFor="language" data-on="PT" data-off="EN">
        <span className="on">PT</span>
        <span className="off">EN</span>
      </label>
    </Wrapper>
  );
}

export default Switch;
