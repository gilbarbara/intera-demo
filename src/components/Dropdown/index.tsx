import React from 'react';
import ReactSelect, { SelectProps } from 'react-dropdown-select';
import { useTranslator } from '@eo-locale/react';
import styled from 'styled-components';

import { DropdownOption } from 'src/types';

import Content from './Content';
import Options from './Options';

interface Props extends SelectProps<DropdownOption> {
  customOptions?: boolean;
}

const Wrapper = styled.div`
  min-width: 160px;
`;

function Dropdown({ customOptions, onChange, ...rest }: Props) {
  const translator = useTranslator();

  const [value] = rest.values || [];

  return (
    <Wrapper>
      <ReactSelect
        key={value?.value}
        autoFocus={false}
        color="#000000"
        contentRenderer={Content}
        dropdownGap={0}
        dropdownHeight="256px"
        dropdownPosition="auto"
        dropdownRenderer={customOptions ? Options : undefined}
        onChange={onChange}
        placeholder={translator.getMessageById('select') as string}
        searchable={false}
        {...rest}
      />
    </Wrapper>
  );
}

export default Dropdown;
