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
    params.set(key, value.toString());
  });
  const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString();
  window.history.pushState({ path: newurl }, '', newurl);
}