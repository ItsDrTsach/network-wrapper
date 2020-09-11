function network({ binId : endpoint = "", binName } , body, {...customConfig} = {}) {
  const API_URL = "https://api.jsonbin.io/v3/b"; // todo: use API v2
  const COLLECTION_ID = "5f58a799302a837e9562e4d3";
  const API_KEY = localStorage.getItem("API_KEY");
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "X-Master-Key": API_KEY,
    "X-COLLECTION-ID": COLLECTION_ID,
    "X-Bin-Name" : binName
  };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  debugger;
  if (body != null) {
    config.body = typeof body === 'string'? body : JSON.stringify(body);
  }
  return fetch(`${API_URL}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        logout()
        window.location.assign(window.location)
        return
      }
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(`${response.status} : '${data.message}'`);
      }
    });
}

network.put = (id, options) => network({binId:id}, null,{method: "PUT", ...options});
network.post = (binName, body, options) => network({binName}, body ,{...options});
network.get = (id, options) => network({binId:id}, null, { ...options});
network.delete = (id, options) => network({binId:id}, null,{method: "DELETE", ...options});

function logout() {
  window.localStorage.removeItem("API_KEY");
}
