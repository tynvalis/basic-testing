// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash');

describe('BankAccount', () => {
  const mockedRandom = random as jest.Mock;

  beforeEach(() => {
    mockedRandom.mockClear();
  });

  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(100);
    expect(() => account.withdraw(150)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const accountA = getBankAccount(100);
    const accountB = getBankAccount(50);
    expect(() => accountA.transfer(150, accountB)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);
    account.withdraw(30);
    expect(account.getBalance()).toBe(70);
  });

  test('should transfer money', () => {
    const accountA = getBankAccount(100);
    const accountB = getBankAccount(50);
    accountA.transfer(40, accountB);
    expect(accountA.getBalance()).toBe(60);
    expect(accountB.getBalance()).toBe(90);
  });

  test('fetchBalance should return a number if the request succeeds', async () => {
    const account = getBankAccount(100);

    mockedRandom.mockReturnValueOnce(123);
    mockedRandom.mockReturnValueOnce(1);

    await expect(account.fetchBalance()).resolves.toBe(123);
  });

  test('synchronizeBalance should update the balance if fetching succeeds', async () => {
    const account = getBankAccount(100);

    mockedRandom.mockReturnValueOnce(500).mockReturnValueOnce(1);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(500);
  });

  test('synchronizeBalance should throw SynchronizationFailedError if fetching fails', async () => {
    const account = getBankAccount(100);

    // The second call to random() returns '0', causing the fetch to fail.
    mockedRandom.mockReturnValueOnce(123).mockReturnValueOnce(0);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
