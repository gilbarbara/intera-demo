import React, { useContext } from 'react';

import { appOptions } from 'src/config';
import { useLocalStorageState } from 'src/modules/helpers';

import { AppOptions } from 'src/types';

export const OptionsContext = React.createContext({
  options: appOptions,
  setOptions: () => undefined,
});
OptionsContext.displayName = 'OptionsContext';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function OptionsProvider(props: any) {
  const [options, setOptions] = useLocalStorageState('intera', appOptions);

  return <OptionsContext.Provider value={{ options, setOptions }} {...props} />;
}

export function useOptions(): {
  options: AppOptions;
  setOptions: (state: Partial<AppOptions>) => void;
} {
  const context = useContext(OptionsContext);

  if (!context) {
    throw new Error('useOptions must be used within a OptionsProvider');
  }

  return context;
}
