async function fetchData(url, method = 'get', data = null) {
  const options = {
    method: method,
  };
  if (data) {
    options.body = data;
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export {fetchData};
