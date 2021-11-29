const cloneDisplay = (display) =>
  display.map((item) => (Array.isArray(item) ? clone(item) : item));

export default cloneDisplay;
