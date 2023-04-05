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

exports.filterColumnUser = (dataUser) => {
  const arrayColumns = [
    "password",
    "passwordChangedAt",
    "confirmCode",
    "isConfirmed",
    "phoneNumber",
    "createdAt",
    "updatedAt",
    "googleFlag",
    "facebookFlag",
  ];

  for (const prop in dataUser) {
    if (arrayColumns.includes(prop)) {
      dataUser[prop] = undefined;
    } else {
      continue;
    }
  }

  return dataUser;
};
