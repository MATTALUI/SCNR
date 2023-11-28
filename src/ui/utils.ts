interface ILegalQueryParams {
  projectId: string;
}

export const parseQueryparams = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  return urlParams;
}

export const pushQueryParams = (newParams: Partial<ILegalQueryParams>) => {
  const params = parseQueryparams();
  Object.entries(newParams).forEach(([key, value]) => {
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
  });
  let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  if (params.size > 0) newurl = newurl + '?' + params.toString();
  window.history.pushState({ path: newurl }, '', newurl);
}