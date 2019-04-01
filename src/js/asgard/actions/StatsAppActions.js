import ajaxWrapper from "../../helpers/ajaxWrapper";
import AppDispatcher from "../../AppDispatcher";
import StatsAppEvents from "../events/StatsAppEvents";
import config from "../../config/config";

var StatsAppActions = {
  requestStats: function (id) {
    this.request({
      url: `${config.apiURL}apps${id}/stats`
    })
      .success(function (stats) {
        AppDispatcher.dispatch({
          actionType: StatsAppEvents.REQUEST,
          data: stats
        });
      })
      .error(function (error) {
        AppDispatcher.dispatch({
          actionType: StatsAppEvents.REQUEST_ERROR,
          data: error
        });
      });
  },
  request: ajaxWrapper
};

export default StatsAppActions;
