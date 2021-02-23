import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SelectProps } from 'react-dropdown-select';
import { Control, FormState, useWatch } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import is from 'is-lite';
import styled from 'styled-components';
import {
  Box,
  FormGroup,
  Input,
  InputTypes,
  Label,
  Select,
  Switch,
  Text,
  Textarea,
} from 'styled-minimal';

import DateSelector from 'src/components/DateSelector';
import Dropdown from 'src/components/Dropdown';
import Icon from 'src/components/Icon';
import Required from 'src/components/Required';

import { DropdownOption, GenericFunction, PlainObject } from 'src/types';

import FieldDebug from './Debug';
import { getError, getRegisterOptions } from './utils';

type FieldTypes = InputTypes | 'dateSelector' | 'dropdown' | 'select' | 'switch' | 'textarea';

interface BaseProps {
  autoComplete?: string;
  children?: React.ReactNode;
  clearError?: GenericFunction;
  control: Control;
  dataset?: PlainObject;
  debug?: boolean;
  disabled?: boolean;
  dropdownOptions?: any;
  filter?: any[];
  formState: FormState<any>;
  id?: string;
  label?: string;
  maxLength?: number;
  minLength?: number;
  multiple?: boolean;
  name: string;
  onBlur?: any;
  onChange?: any;
  onFocus?: any;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  rows?: number;
  rules?: string[];
  setError?: GenericFunction;
  showLabel?: boolean;
  text?: React.ReactNode | string;
  type: FieldTypes;
}

export type Props = BaseProps &
  (
    | {
        type: InputTypes | 'dateSelector' | 'switch';
        onBlur?: React.FocusEventHandler<HTMLInputElement>;
        onChange?: React.ChangeEventHandler<HTMLInputElement>;
        onFocus?: React.FocusEventHandler<HTMLInputElement>;
      }
    | {
        type: 'textarea';
        onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
        onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
        onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
      }
    | {
        type: 'select';
        onBlur?: React.FocusEventHandler<HTMLSelectElement>;
        onChange?: React.ChangeEventHandler<HTMLSelectElement>;
        onFocus?: React.FocusEventHandler<HTMLSelectElement>;
      }
    | {
        type: 'dropdown';
        dropdownOptions: SelectProps<DropdownOption> & {
          isLoading: boolean;
          options: DropdownOption[];
          selected: DropdownOption[];
        };
        onChange?: (value: DropdownOption[]) => void;
      }
  );

const FieldWrapper = styled(Box)<{ isValid?: boolean }>`
  margin-bottom: var(--gutter-sm);
  position: relative;
`;

const FieldIcon = styled(Box)<{ centered: boolean }>`
  color: currentColor;
  line-height: 1;
  position: absolute;
  right: 8px;
  top: ${({ centered }) => (centered ? '50%' : '8px')};
  transform: ${({ centered }) => (centered ? 'translateY(-50%)' : 'none')};
`;

export function Field(props: Props) {
  const {
    children,
    clearError,
    control,
    debug,
    dropdownOptions,
    filter,
    formState,
    label,
    rules = [],
    setError,
    text,
    type = 'text',
    ...input
  } = props;
  const { disabled, name, onBlur, onChange, onFocus, required } = input;
  const { errors } = formState;
  const { register, setValue, unregister } = control;

  const [active, setActive] = useState(false);
  const [isRunning, setRunning] = useState(false);
  const [isValidated, setValidated] = useState(false);

  const value = useWatch<undefined | any>({ control, name });
  const registerOptions = useMemo(
    () => getRegisterOptions(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [error, errorType = ''] = getError(name, errors, value);

  useMount(() => {
    if (['dropdown', 'switch'].includes(type)) {
      register({ name, type: 'custom' }, registerOptions);
    }
  });

  useUnmount(() => {
    unregister(name);
  });

  // Check if async validation was running
  useEffect(() => {
    if (isRunning && rules.includes('has-account')) {
      if (!error || errorType.endsWith('Async')) {
        setRunning(false);
        setValidated(true);
      }
    }
  }, [active, error, errorType, isRunning, rules]);

  const handleFocus = useCallback(
    e => {
      setActive(true);
      if (onFocus) {
        onFocus(e);
      }
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    e => {
      setActive(false);

      if (onBlur) {
        onBlur(e);
      }
    },
    [onBlur],
  );

  const handleChange = useCallback(
    e => {
      if (onChange) {
        onChange(e);
      }
    },
    [onChange],
  );

  const handleChangeData = useCallback(
    (data: any) => {
      let cleanData = data;

      if (is.string(data)) {
        cleanData = data.replace(/^<p><\/p>\n$/, '');
      }

      setValue(name, cleanData, {
        shouldValidate: true,
        shouldDirty: true,
      });

      if (input.onChange) {
        input.onChange(cleanData);
      }
    },
    [input, name, setValue],
  );

  const handleChangeDateSelector = useCallback(
    (data: string) => {
      setValue(name, data, { shouldValidate: true, shouldDirty: true });
    },
    [name, setValue],
  );

  const handleChangeDropdown = useCallback(
    (data: DropdownOption[]) => {
      const [selected] = data;

      /* istanbul ignore else */
      if (selected) {
        const stringValue = `${selected.value}:${selected.label}`;
        setValue(name, stringValue, { shouldValidate: true, shouldDirty: true });

        if (!value || value !== stringValue) {
          handleChange(stringValue);
        }
      }
    },
    [setValue, name, value, handleChange],
  );

  input.id = input.id || name;
  input.onBlur = handleBlur;
  input.onChange = handleChange;
  input.onFocus = handleFocus;

  const showError = !!error && errorType !== 'revalidate' && (!active || isValidated);
  const isValid = !!value && !error;

  const iconCentered = !['rich-text', 'textarea'].includes(type);
  const groupProps: PlainObject = {};
  const inputProps: PlainObject = {};
  const output: PlainObject<any> = { error };

  /* istanbul ignore else */
  if (required) {
    if (showError) {
      groupProps.color = 'red';
      inputProps.valid = false;
      output.icon = (
        <FieldIcon centered={iconCentered}>
          <Icon name="close" />
        </FieldIcon>
      );
    } else if (isValid) {
      groupProps.color = 'green';
      inputProps.valid = true;
      output.icon = (
        <FieldIcon centered={iconCentered}>
          <Icon name="check" />
        </FieldIcon>
      );
    }
  }

  if (['checkbox', 'radio'].includes(type)) {
    output.content = (
      <Label>
        <input
          {...input}
          className="form-check-input"
          ref={register(registerOptions)}
          type={type}
        />
        <Icon name="check" />
        {label}
      </Label>
    );
  } else if (type === 'dateSelector') {
    output.content = (
      <FieldWrapper isValid={isValid}>
        <DateSelector onChange={handleChangeDateSelector} />
        <input {...input} ref={register(registerOptions)} type="hidden" />
      </FieldWrapper>
    );
  } else if (type === 'dropdown') {
    const { selected = [], ...rest } = dropdownOptions || {};

    output.content = (
      <FieldWrapper isValid={isValid}>
        <Dropdown {...rest} onChange={handleChangeDropdown} values={selected || undefined} />
        <input {...input} ref={register(registerOptions)} type="hidden" />
      </FieldWrapper>
    );
  } else if (type === 'select') {
    output.content = (
      <FieldWrapper>
        <Select {...input} ref={register(registerOptions)} {...inputProps}>
          {children}
        </Select>
      </FieldWrapper>
    );
  } else if (type === 'switch') {
    output.content = (
      <FieldWrapper key={name}>
        <Switch
          disabled={disabled}
          name={name}
          onChange={handleChangeData}
          defaultChecked={value}
        />
      </FieldWrapper>
    );
  } else if (type === 'textarea') {
    output.content = (
      <FieldWrapper>
        <Textarea {...input} ref={register(registerOptions)} {...inputProps} />
        {output.icon}
      </FieldWrapper>
    );
  } else if (type === 'hidden') {
    return <input {...input} ref={register(registerOptions)} type="hidden" />;
  } else {
    output.content = (
      <FieldWrapper>
        <Input {...input} ref={register(registerOptions)} type={type} {...inputProps} />
        {output.icon}
      </FieldWrapper>
    );
  }

  if (label) {
    output.label = (
      <React.Fragment>
        {label}
        {required && <Required />}
      </React.Fragment>
    );
  }

  return (
    <FormGroup
      label={output.label}
      labelId={input.id}
      labelStyles={{ alignItems: 'flex-start' }}
      css={{
        [`label:empty`]: {
          display: 'none',
        },
      }}
      mb={0}
      {...groupProps}
    >
      {output.content}
      {text && (
        <Text cl="#999" fontSize="85%">
          {text}
        </Text>
      )}
      {showError && (
        <Box fontSize="85%" mt={1}>
          {output.error}
        </Box>
      )}
      <FieldDebug {...props} />
    </FormGroup>
  );
}

Field.defaultProps = {
  label: '',
};

export default React.memo(Field);
