import ajaxWrapper from "../../helpers/ajaxWrapper";
// import config from "../config/config";
import AppDispatcher from "../../AppDispatcher";
import SlaveEvents from "../events/AgentsEvents";
import config from "../../config/config";

var AgentsActions = {
  requestAgents: function () {
    this.request({
      url: `${config.apiURL}agents`
    })
      .success(function (agents) {
        AppDispatcher.dispatch({
          actionType: SlaveEvents.REQUEST,
          data: agents
        });
      })
      .error(function (error) {
        AppDispatcher.dispatch({
          actionType: SlaveEvents.REQUEST_ERROR,
          data: error
        });
      });
  },
  requestAttrs: function (label, value) {
    this.request({
      url: `${config.apiURL}agents/with-attrs?${label}=${value}`
    })
      .success(function (agents) {
        AppDispatcher.dispatch({
          actionType: SlaveEvents.REQUEST,
          data: agents
        });
        console.log(agents);
      })
      .error(function (error) {
        AppDispatcher.dispatch({
          actionType: SlaveEvents.REQUEST_ERROR,
          data: error
        });
      });
  },
  request: ajaxWrapper
};

export default AgentsActions;
