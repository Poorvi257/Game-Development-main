import { atom } from 'recoil';

export const valorantDataState = atom({
  key: 'valorantDataState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const selectedAgentAtom = atom({
    key: 'selectedAgent', // unique ID (with respect to other atoms/selectors)
    default: "", // default value (aka initial value)
  });
  