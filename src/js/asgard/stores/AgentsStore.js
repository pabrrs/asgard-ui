import { EventEmitter } from "events";

import AppDispatcher from "../../AppDispatcher";
import AppsStore from "../../stores/AppsStore";
import AgentsEvents from "../events/AgentsEvents";
import AgentsScheme from "./schemes/AgentsScheme";
import Util from "../../helpers/Util";
import TotalStatsApp from "./schemes/TotalStatsApp";

const storeData = {
  agents: [],
  stats: [],
  filter: "",
  total: ""
};

function processAgents(agents) {
  console.log("meu agents processado", agents);
  return agents.agents.map(function(agent) {
    agent = Util.extendObject(AgentsScheme, agent);
    return agent;
  });
}

function processStats(stats) {
  console.log("meu stats", stats);
  const stat = Util.extendObject(TotalStatsApp, stat);
  return stat;
}

var AgentsStore = Util.extendObject(EventEmitter.prototype, {
  get agents() {
    return Util.deepCopy(storeData.agents);
  },
  get filter() {
    return Util.deepCopy(storeData.filter);
  },
  get total() {
    return Util.deepCopy(storeData.total);
  },
  get stats() {
    return Util.deepCopy(storeData.stats);
  }
});

AppsStore.on(AgentsEvents.CHANGE, function() {
  storeData.agents.forEach(deployment => {
    detectIsWaitingForUserAction(deployment);
  });

  AgentsStore.emit(AgentsEvents.CHANGE);
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AgentsEvents.REQUEST:
      storeData.agents = processAgents(action.data.body);
      storeData.total = action.data.body;
      storeData.stats = processStats(action.data.body);
      AgentsStore.emit(AgentsEvents.CHANGE);
      break;
    case AgentsEvents.FILTER:
      storeData.filter = action.data;
      AgentsStore.emit(AgentsEvents.FILTER, action.data);
      break;
    case AgentsEvents.REQUEST_ERROR:
      AgentsStore.emit(
        AgentsEvents.REQUEST_ERROR,
        action.data.body,
        action.data.status
      );
      break;
    case AgentsEvents.REVERT:
      storeData.agents = removeDeployment(
        storeData.agents,
        action.deploymentId
      );
      AgentsStore.emit(AgentsEvents.CHANGE);
      break;
    case AgentsEvents.REVERT_ERROR:
      AgentsStore.emit(
        AgentsEvents.REVERT_ERROR,
        action.data.body,
        action.data.status
      );
      break;
  }
});

export default AgentsStore;
