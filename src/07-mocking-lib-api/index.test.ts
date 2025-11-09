import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

jest.mock('lodash', () => ({
  throttle: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
}));

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const getMock = jest.fn<Promise<{ data: unknown }>, [string]>();

  beforeEach(() => {
    mockedAxios.create.mockReturnValue({
      get: getMock,
    } as unknown as ReturnType<typeof axios.create>);

    getMock.mockReset();
  });

  test('should create instance with provided base url', async () => {
    getMock.mockResolvedValueOnce({ data: {} });

    await throttledGetDataFromApi('/posts');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    getMock.mockResolvedValueOnce({ data: {} });

    await throttledGetDataFromApi('/users');

    expect(getMock).toHaveBeenCalledWith('/users');
  });

  test('should return response data', async () => {
    const mockData = [{ id: 1, title: 'test' }];

    getMock.mockResolvedValueOnce({ data: mockData });

    const result = await throttledGetDataFromApi('/posts');

    expect(result).toEqual(mockData);
  });
});
