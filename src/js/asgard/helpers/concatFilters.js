
const ConcatFilter = {
  format: function (params) {
    let queryParams = "";
    let count=0;
    Object.keys(params).forEach(key => {
      let value = params[key];
      if (count !== 0 && value === " ") {
        queryParams += "&";
      }
      else {
        queryParams += `${value}`;
      }
      count++;
    });
    return queryParams;
  }
};

export default ConcatFilter;