import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

const mockedExistsSync = existsSync as jest.Mock;
const mockedReadFile = readFile as jest.Mock;
const mockedJoin = join as jest.Mock;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);

    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1500;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 500;

    doStuffByInterval(callback, interval);

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, interval);

    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval * 2);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const filePath = 'test.txt';
  const fullPath = '/mocked/path/test.txt';

  beforeEach(() => {
    mockedExistsSync.mockClear();
    mockedReadFile.mockClear();
    mockedJoin.mockClear();
  });

  test('should call join with pathToFile', async () => {
    mockedJoin.mockReturnValue(fullPath);
    await readFileAsynchronously(filePath);
    expect(mockedJoin).toHaveBeenCalledWith(expect.any(String), filePath);
  });

  test('should return null if file does not exist', async () => {
    mockedExistsSync.mockReturnValue(false);
    mockedJoin.mockReturnValue(fullPath);

    const result = await readFileAsynchronously(filePath);

    expect(result).toBeNull();
    expect(mockedReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'Hello, world!';
    mockedExistsSync.mockReturnValue(true);
    mockedJoin.mockReturnValue(fullPath);
    mockedReadFile.mockResolvedValue(Buffer.from(fileContent));

    const result = await readFileAsynchronously(filePath);

    expect(result).toBe(fileContent);
    expect(mockedReadFile).toHaveBeenCalledWith(fullPath);
  });
});
