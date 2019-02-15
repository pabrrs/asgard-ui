import {EventEmitter} from "events";

import AppDispatcher from "../../AppDispatcher";
import AppsStore from "../../stores/AppsStore";
import AppsEvents from "../events/AgentsEvents";
import AgentsEvents from "../events/AgentsEvents";
// import AgentsEvents from "./schemes/AgentsScheme";
import AgentsScheme from "./schemes/AgentsScheme";

import Util from "../../helpers/Util";

const storeData = {
  agents: []
};

function processAgents(agents) {
  return agents.agents.map(function (agent) {
    agent = Util.extendObject(AgentsScheme, agent);
    // agent.affectedAppsString = agent.affectedApps.join(", ");

    // deployment.id = deployment.id.join(", ");
    // deployment.currentActionsString = deployment.currentActions.join(", ");
    // detectIsWaitingForUserAction(deployment);

    return agent;
  });
}

function removeDeployment(agents, deploymentId) {
  return agents.filter(deployment => deployment.id !== deploymentId);
}

function detectIsWaitingForUserAction(deployment) {
  deployment.currentActions.forEach(action => {
    const results = action.readinessCheckResults;
    action.isWaitingForUserAction = false;

    // Detect if the migration API is supported by the app and at least
    // one migration phase is waiting for user decision
    if (results != null && results.length > 0) {
      action.isWaitingForUserAction = results.some(result => {
        if (result.lastResponse == null || result.lastResponse.body == null) {
          return false;
        }

        let status;

        try {
          status = JSON.parse(result.lastResponse.body).status;
        } catch (e) {
          return false;
        }

        if (status != null && status === "Waiting") {
          const app = AppsStore.getCurrentApp(action.app);
          return !!app.hasMigrationApiSupport;
        }

        return false;
      });
    }
  });
}

var AgentsStore = Util.extendObject(EventEmitter.prototype, {
  get agents() {
    return Util.deepCopy(storeData.agents);
  }
});

AppsStore.on(AppsEvents.CHANGE, function () {
  storeData.agents.forEach(deployment => {
    detectIsWaitingForUserAction(deployment);
  });

  AgentsStore.emit(AgentsEvents.CHANGE);
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AgentsEvents.REQUEST:
      storeData.agents = processAgents(action.data.body);
      AgentsStore.emit(AgentsEvents.CHANGE);
      break;
    case AgentsEvents.REQUEST_ERROR:
      AgentsStore.emit(
        AgentsEvents.REQUEST_ERROR,
        action.data.body,
        action.data.status
      );
      break;
    case AgentsEvents.REVERT:
      storeData.agents =
        removeDeployment(storeData.agents, action.deploymentId);
      AgentsStore.emit(AgentsEvents.CHANGE);
      break;
    case AgentsEvents.REVERT_ERROR:
      AgentsStore.emit(
        AgentsEvents.REVERT_ERROR,
        action.data.body,
        action.data.status
      );
      break;
    case AgentsEvents.CONTINUE_MIGRATION_SUCCESS:
      AgentsStore.emit(AgentsEvents.CONTINUE_MIGRATION_SUCCESS,
        action.data.body,
        action.appId
      );
      break;
    case AgentsEvents.CONTINUE_MIGRATION_ERROR:
      AgentsStore.emit(AgentsEvents.CONTINUE_MIGRATION_ERROR,
        action.data.body,
        action.data.status,
        action.appId
      );
      break;
  }
});

export default AgentsStore;
