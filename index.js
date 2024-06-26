import axios from 'axios';

const servers = [
  {
    url: "https://does-not-work.perfume.new",
    priority: 1
  },
  {
    url: "https://gitlab.com",
    priority: 4
  },
  {
    url: "http://app.scnt.me",
    priority: 3
  },
  {
    url: "https://offline.scentronix.com",
    priority: 2
  }
];

async function checkServer(server) {
  try {
    const response = await axios.get(server.url, { timeout: 5000 });
    if (response.status >= 200 && response.status < 300) {
      return true;
    }
  } catch (error) {
    // Ignore errors, return false
  }
  return false;
}

async function findServer() {
  const checkPromises = servers.map(server =>
    checkServer(server).then(isOnline => ({ server, isOnline }))
  );

  const results = await Promise.all(checkPromises);

  const onlineServers = results.filter(result => result.isOnline);

  if (onlineServers.length === 0) {
    throw new Error('No servers are online');
  }

  onlineServers.sort((a, b) => a.server.priority - b.server.priority);

  return onlineServers[0].server;
}

export { findServer, checkServer, servers };
