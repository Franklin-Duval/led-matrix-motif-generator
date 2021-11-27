const cloneDisplay = (display) =>
  dusplay.map((item) => (Array.isArray(item) ? clone(item) : item));

export default cloneDisplay;
