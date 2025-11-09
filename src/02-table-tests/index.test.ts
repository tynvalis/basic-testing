import { simpleCalculator, Action } from './index';

const testCases = [
  // Add action cases
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: -5, b: 10, action: Action.Add, expected: 5 },
  { a: 0, b: 0, action: Action.Add, expected: 0 },

  // Subtract action cases
  { a: 10, b: 5, action: Action.Subtract, expected: 5 },
  { a: 5, b: 10, action: Action.Subtract, expected: -5 },
  { a: 0, b: 5, action: Action.Subtract, expected: -5 },
  { a: -5, b: -5, action: Action.Subtract, expected: 0 },

  // Multiply action cases
  { a: 2, b: 4, action: Action.Multiply, expected: 8 },
  { a: -3, b: 5, action: Action.Multiply, expected: -15 },
  { a: 10, b: 0, action: Action.Multiply, expected: 0 },
  { a: -5, b: -4, action: Action.Multiply, expected: 20 },

  // Divide action cases
  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 10, b: 4, action: Action.Divide, expected: 2.5 },
  { a: -20, b: 5, action: Action.Divide, expected: -4 },
  { a: 0, b: 100, action: Action.Divide, expected: 0 },

  // Exponentiate action cases
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 0, action: Action.Exponentiate, expected: 1 },
  { a: 3, b: 1, action: Action.Exponentiate, expected: 3 },
  { a: 4, b: 0.5, action: Action.Exponentiate, expected: 2 },

  // Invalid action cases
  { a: 1, b: 2, action: '&', expected: null },
  { a: 5, b: 10, action: 'modulo', expected: null },

  // Invalid arguments cases
  { a: '1', b: 2, action: Action.Add, expected: null },
  { a: 1, b: '2', action: Action.Add, expected: null },
  { a: null, b: 2, action: Action.Add, expected: null },
  { a: 1, b: undefined, action: Action.Add, expected: null },
  { a: [1], b: 2, action: Action.Add, expected: null },
  { a: { num: 1 }, b: 2, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return $expected for $a $action $b',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
