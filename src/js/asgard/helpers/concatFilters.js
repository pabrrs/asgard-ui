
const ConcatFilter = {
  format: function (params) {
    var queryParams = "";
    var count=0;
    Object.keys(params).forEach(key => {
      var value = params[key];
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