import React, { useEffect, useMemo, useRef } from 'react';
import { SelectRenderer } from 'react-dropdown-select';
import { textColor } from 'colorizr';

import { sortByLocaleCompare } from 'src/modules/helpers';

import { DropdownOption } from 'src/types';

function DropdownOptions(props: SelectRenderer<DropdownOption>) {
  const {
    methods: { addItem, setSearch },
    props: { additionalProps, color: bgColor = '#fff', options },
    state: { search, values },
  } = props;
  const searchInput = useRef<HTMLInputElement>(null);
  const color = useMemo(() => textColor(bgColor), [bgColor]);

  const regexp = new RegExp(search, 'i');
  const selected = values[0] || {};

  useEffect(() => {
    const { current } = searchInput;

    /* istanbul ignore else*/
    if (current) {
      current.focus();
    }
  }, []);

  return (
    <div className="app__dropdown__options" role="list">
      <div className="app__dropdown__search">
        <input
          ref={searchInput}
          onChange={setSearch}
          type="text"
          value={search}
          {...additionalProps}
        />
      </div>
      <div>
        {options
          .filter(item => regexp.test(`${item.label}`))
          .sort(
            sortByLocaleCompare<DropdownOption>('label', { numeric: true, sensitivity: 'base' }),
          )
          .map(option => {
            const { content: Content } = option;
            let style;

            if (option.value === selected.value) {
              style = { backgroundColor: bgColor, color };
            }

            return (
              <div
                key={option.value}
                className="app__dropdown__item"
                onClick={() => addItem(option)}
                style={style}
              >
                {!!Content && <Content />}
                <span>{option.label}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default DropdownOptions;
