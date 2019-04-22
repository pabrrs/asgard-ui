import ajaxWrapper from "../../helpers/ajaxWrapper";
import AppDispatcher from "../../AppDispatcher";
import SlaveEvents from "../events/AgentsEvents";
import config from "../../config/config";
import AgentsStore from "../stores/AgentsStore";

var AgentsActions = {
  requestAgents: function() {
    this.request({
      url: `${config.apiURL}agents/with-attrs?${AgentsStore.filter}`
    })
      .success(function(agents) {
        console.log("meu agents", agents);
        AppDispatcher.dispatch({
          actionType: SlaveEvents.REQUEST,
          data: agents
        });
      })
      .error(function(error) {
        AppDispatcher.dispatch({
          actionType: SlaveEvents.REQUEST_ERROR,
          data: error
        });
      });
  },
  requestTotalApps: function () {
    this.request({
      url: `${config.apiURL}agents/with-attrs?`
    })
      .success(function (agents) {
        AppDispatcher.dispatch({
          actionType: SlaveEvents.TOTAL,
          data: agents.body.agents.length
        });
      })
      .error(function(error) {
        AppDispatcher.dispatch({
          actionType: SlaveEvents.REQUEST_ERROR,
          data: error
        });
      });
  },
  setFilter: function(value) {
    AppDispatcher.dispatch({
      actionType: SlaveEvents.FILTER,
      data: value
    });
  },
  requestAgentsApps: function(id) {
    this.request({
      url: `${config.apiURL}agents/${id}/apps`
    })
      .success(function(agents) {
        AppDispatcher.dispatch({
          actionType: SlaveEvents.REQUEST,
          data: agents
        });
      })
      .error(function(error) {
        AppDispatcher.dispatch({
          actionType: SlaveEvents.REQUEST_ERROR,
          data: error
        });
      });
  },
  request: ajaxWrapper
};

export default AgentsActions;
