import { Control, UseFormMethods } from 'react-hook-form';
import is from 'is-lite';

import { PlainObject } from 'src/types';

interface RegisterOptionsProps {
  control: Control;
  maxLength?: number;
  minLength?: number;
  name: string;
  required?: boolean;
  rules?: any[];
  skipValidation?: boolean;
  type: string;
}

export function getError(name: string, errors: PlainObject<any>, value: any) {
  const { message, type } = errors[name] || {};

  if (message && value) {
    return [message, type];
  }

  return [null];
}

export function getRegisterOptions(
  props: RegisterOptionsProps,
): Partial<UseFormMethods['register']> {
  const { maxLength, minLength, required, rules = [], skipValidation } = props;
  const registerOptions = {} as PlainObject;

  if (skipValidation) {
    return registerOptions;
  }

  if (required) {
    registerOptions.required = true;
  }

  if (minLength) {
    registerOptions.minLength = {
      value: minLength,
      message: `Min. Characters: ${minLength}`,
    };
  }

  if (maxLength) {
    registerOptions.maxLength = {
      value: maxLength,
      message: `Max. Characters: ${maxLength}`,
    };
  }

  if (rules.length) {
    registerOptions.validate = rules.reduce((acc, validation) => {
      const fnName = validation.name || validation.fn.name;

      acc[fnName] = async (value: string) => {
        let response = null;

        if (is.function(validation)) {
          response = await validation(value);
        } else if (validation.field && is.function(validation.fn)) {
          const actualValues = props.control.getValues();

          response = await validation.fn(actualValues[validation.field], value);
        }

        return response;
      };

      return acc;
    }, {});
  }

  return registerOptions;
}
