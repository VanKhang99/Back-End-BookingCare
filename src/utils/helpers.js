exports.checkInfo = (data, propsArrInfo) => {
  let isValid = true;

  for (const property of propsArrInfo) {
    if (property === "popular" || property === "haveSpecialtyPage" || property === "remote") {
      continue;
    }

    if (!data[property]) {
      isValid = false;
      break;
    }
  }

  return isValid;
};
