// @flow
import {
  reducers as defaultReducers,
  Effect as DefaultEffect
} from './default';

import debounce from 'lodash.debounce';

const Effect = {
  ...DefaultEffect
};

Effect.Search = (dispatch, getState, getProps, getInstance) => {
  DefaultEffect.Search(false)(dispatch, getState, getProps, getInstance);
  dispatch({ type: 'Open' });
};

Effect.DebouncedSearch = debounce(Effect.Search, 300);

const reducers = {
  ...defaultReducers,
  Focus: (state, props, action) => {
    const textValue = props.value ? props.valueToString(props.value) : '';
    if (!textValue) {
      return [
        {
          ...state,
          editing: true,
          opened: false,
          items: null
        },
        [Effect.Focus]
      ];
    }

    return [
      {
        ...state,
        textValue,
        editing: true,
        opened: true,
        items: null
      },
      [Effect.Search, Effect.Focus]
    ];
  },
  TextChange: (state, props, action) => {
    if (!action.value) {
      return [
        {
          ...state,
          textValue: '',
          opened: false,
          items: null
        },
        [Effect.InputChange]
      ];
    }
    return [
      {
        ...state,
        textValue: action.value
      },
      [
        Effect.DebouncedSearch,
        DefaultEffect.InputChange
      ]
    ];
  },
  Open: (state, props, action) => {
    return {
      ...state,
      opened: true
    };
  }
};

export { reducers };