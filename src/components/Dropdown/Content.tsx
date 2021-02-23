import React from 'react';
import { SelectRenderer } from 'react-dropdown-select';

import { DropdownOption } from 'src/types';

function DropdownContent({
  props: { placeholder },
  state: { values },
}: SelectRenderer<DropdownOption>) {
  const [option] = values;
  const { content: Content } = option || {};

  if (option) {
    return (
      <div className="app__dropdown__content">
        {!!Content && <Content />}
        <span>{option.label}</span>
      </div>
    );
  }

  return <div className="app__dropdown__placeholder">{placeholder}</div>;
}

export default DropdownContent;
