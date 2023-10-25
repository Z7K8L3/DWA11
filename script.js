/**
 * Maximum allowed count.
 * @type {number}
 */
const MAX_NUMBER = 15;

/**
 * Minimum allowed count.
 * @type {number}
 */
const MIN_NUMBER = 0;

/**
 * Amount to increment or decrement the count.
 * @type {number}
 */
const STEP_AMOUNT = 5;

/**
 * Represents the initial state of the Tally App.
 * @typedef {Object} TallyState
 * @property {number} count - The current count.
 */

/**
 * Redux-like action types for the Tally App.
 * @readonly
 * @enum {string}
 */
const ActionType = {
  ADD: 'ADD',
  SUBTRACT: 'SUBTRACT',
  RESET: 'RESET',
};

/**
 * Reducer function for updating the Tally App state.
 * @param {TallyState} state - The current state.
 * @param {Object} action - The action to be applied.
 * @returns {TallyState} The new state after applying the action.
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD:
      return {
        count: Math.min(state.count + STEP_AMOUNT, MAX_NUMBER),
      };
    case ActionType.SUBTRACT:
      return {
        count: Math.max(state.count - STEP_AMOUNT, MIN_NUMBER),
      };
    case ActionType.RESET:
      return {
        count: 0,
      };
    default:
      return state;
  }
};

/**
 * Creates a Redux-like store for managing state.
 * @param {function} reducer - A reducer function to update the state.
 * @returns {object} An object representing the store.
 */
const createStore = (reducer) => {
  let state = reducer(undefined, {}); // Initial state
  let listeners = [];

  /**
   * Get the current state.
   * @returns {TallyState} The current state.
   */
  const getState = () => state;

  /**
   * Dispatch an action to update the state.
   * @param {Object} action - The action to be dispatched.
   */
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  /**
   * Subscribe to state changes.
   * @param {Function} listener - A function to be called when the state changes.
   * @returns {Function} A function to unsubscribe from the store.
   */
  const subscribe = (listener) => {
    listeners.push(listener);
    // Return a function to unsubscribe
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  return { getState, dispatch, subscribe };
};

// Create the store using the reducer.
const store = createStore(reducer);

// Add a subscription to log state changes.
const unsubscribe = store.subscribe(() => {
  console.log('Current state:', store.getState());
});

// Test the scenarios
console.log('SCENARIO: Initial state');
console.log('State should be 0:', store.getState());

console.log('SCENARIO: Increment the counter by one');
store.dispatch({ type: ActionType.ADD });
store.dispatch({ type: ActionType.ADD });
console.log('State should be 2:', store.getState());

console.log('SCENARIO: Decrement the counter by one');
store.dispatch({ type: ActionType.SUBTRACT });
console.log('State should be 1:', store.getState());

console.log('SCENARIO: Resetting the Tally Counter');
store.dispatch({ type: ActionType.RESET });
console.log('State should be 0:', store.getState());

// Unsubscribe from the store when done
unsubscribe();
