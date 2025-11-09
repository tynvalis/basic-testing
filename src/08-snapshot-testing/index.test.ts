import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const list = generateLinkedList([2, 3, 4]);
    const expectedList = {
      value: 2,
      next: {
        value: 3,
        next: {
          value: 4,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };
    expect(list).toStrictEqual(expectedList);
  });
  test('should generate linked list from values 2', () => {
    const list = generateLinkedList(['d', 'c', 'a']);
    expect(list).toMatchSnapshot();
  });
});
