const localStorageKey = "API_KEY"

function network(endpoint, {baseUrl, body, ...customConfig} = {}) {
  const url = `${baseUrl}/${endpoint}`;
  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...customConfig.headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  console.log(`Sending ${config.method} to ${url} with data:`, body);
  return fetch(url, config).then(async (response) => {
    if (response.status === 401) {
      logout();
      location.assign(location);
      return;
    }
    const data = await response.json();
    if (response.ok) {
      console.log(`Got response ${response.status}`, data);
      return data;
    } else {
      console.error(`${response.status} : '${data.message}'`);
      return Promise.reject(`${response.status} : '${data.message}'`);
    }
  });
}
network.put = (id, options) => network(id, {method: "PUT", ...options});
network.post = (id, options) => network(id, {method: "POST", ...options});
network.get = (id, options) => network(id, {method: "GET", ...options});
network.delete = (id, options) => network(id, {method: "DELETE", ...options});
function logout() {
  localStorage.removeItem(localStorageKey);
}
function jsonBinNetwork({binId = "", binName}, {customLogoutFunc, customLogger, headers: customHeaders, ...customConfig} = {}) {
  const COLLECTION_ID = "5f1d6d37c58dc34bf5dafba4";
  const API_KEY = localStorage.getItem(localStorageKey);
  const config = {
    baseUrl: "https://api.jsonbin.io/v3/b",
    headers: {
      "X-COLLECTION-ID": COLLECTION_ID,
      "X-Master-Key": API_KEY,
      ...(binName ? { "X-Bin-Name": binName } : {}),
      ...customHeaders,
    },
    ...customConfig,
  };
  return network(binId, config);
}