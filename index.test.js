import axios from 'axios';
import { findServer, servers } from './index';

jest.mock('axios');

describe('findServer', () => {
  it('should return the online server with the lowest priority', async () => {
    // Mock server responses
    axios.get.mockImplementation(url => {
      switch (url) {
        case servers[0].url:
          return Promise.reject(new Error('Network error'));
        case servers[1].url:
          return Promise.resolve({ status: 200 });
        case servers[2].url:
          return Promise.resolve({ status: 200 });
        case servers[3].url:
          return Promise.reject(new Error('Network error'));
        default:
          return Promise.reject(new Error('Unknown URL'));
      }
    });

    const server = await findServer();

    expect(server).toEqual(servers[2]);
  });

  it('should throw an error if no servers are online', async () => {
    // Mock server responses
    axios.get.mockImplementation(() => Promise.reject(new Error('Network error')));

    await expect(findServer()).rejects.toThrow('No servers are online');
  });
});
