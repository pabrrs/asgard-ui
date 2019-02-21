const formatPercentage = {
  format: function (value1, value2) {
    const percetage = (value1/value2) * 100;
    const result = Math.trunc(percetage);
    return result;
  }
};
export default formatPercentage;
