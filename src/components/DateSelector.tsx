import React, { useEffect, useMemo, useState } from 'react';
import { useTranslator } from '@eo-locale/react';
import { Group } from 'styled-minimal';

import { useOptions } from 'src/modules/context';
import { pad } from 'src/modules/helpers';

import { DropdownOption } from 'src/types';

import Dropdown from './Dropdown';

type FormatDate = ReturnType<typeof useTranslator>['formatDate'];

interface Props {
  onChange: (date: string) => void;
}

/**
 * Get an Array with all months.
 * The 'value' prop is 0-based, like the JavaScript Date (jan=0, feb=1, mar=2, ...)
 */
export function getMonthsList(formatDate: FormatDate): DropdownOption[] {
  // change the day to avoid timezone conversions in the end of the month
  const date = new Date();
  date.setDate(3);

  return Array.from({ length: 12 }, (_, i) => {
    const month = new Date(date.setMonth(i));

    return {
      label: formatDate(month, { month: 'long' }),
      type: 'month',
      value: i,
    };
  });
}

/**
 * Get an Array with all years from `minYear` back to `minYear - length`
 */
export function getYearsList(
  minYear: number = new Date().getFullYear(),
  length = 60,
): DropdownOption[] {
  return Array(length)
    .fill(1)
    .map((_, i) => {
      const val = minYear - i;

      return { label: val, type: 'year', value: val };
    });
}

function DateSelector({ onChange }: Props): JSX.Element {
  const [month, setMonth] = useState<number | string>();
  const [year, setYear] = useState<number | string>();
  const { options } = useOptions();
  const translator = useTranslator(options.locale);

  const months = useMemo(() => getMonthsList(translator.formatDate), [translator]);
  const years = useMemo(getYearsList, []);

  useEffect(() => {
    if (month && year) {
      onChange(`${year}/${month}`);
    }
  }, [month, onChange, year]);

  const handleChange = (data: DropdownOption[]) => {
    if (data.length) {
      const [{ type, value }] = data;

      if (type === 'month') {
        setMonth(pad(Number(value)));
      } else {
        setYear(value);
      }
    }
  };

  return (
    <Group gap={3}>
      <Dropdown
        dropdownPosition="top"
        onChange={handleChange}
        options={months}
        placeholder={translator.getMessageById('formMonth') as string}
        values={[]}
      />
      <Dropdown
        dropdownPosition="top"
        onChange={handleChange}
        options={years}
        placeholder={translator.getMessageById('formYear') as string}
        values={[]}
      />
    </Group>
  );
}

export default DateSelector;
