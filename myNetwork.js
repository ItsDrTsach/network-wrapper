function cleanNetwork(makeApiHeaders) {
  return function(binId , body, {...customConfig} = {}){
    const headers = makeApiHeaders();// return an object with api headers 
    const config = {
      method: body ? "POST" : "GET",
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    };
    if (body != null) {
      config.body = JSON.stringify(body);
    }
  
    return fetch(`${API_URL}/${binId}`, config)
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
  
}

function makeJsonBinHeadersV3(){
  const API_URL = "https://api.jsonbin.io/v3/b"; 
  const COLLECTION_ID = "5f58a799302a837e9562e4d3";
  const API_KEY = localStorage.getItem("API_KEY");
  return {
    "Content-Type": "application/json; charset=utf-8",
    "X-Master-Key": API_KEY,
    "X-COLLECTION-ID": COLLECTION_ID
  }
}
const network = cleanNetwork(makeJsonBinHeadersV3)

