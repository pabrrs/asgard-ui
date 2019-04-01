import {EventEmitter} from "events";

import AppDispatcher from "../../AppDispatcher";
import AppsStore from "../../stores/AppsStore";
// import AppsEvents from "../events/AgentsEvents";
import StatsAppEvents from "../events/StatsAppEvents";
import StatsAppScheme from "./schemes/StatsAppScheme";
import Util from "../../helpers/Util";

const storeData = {
  stats: [],
};

function processStats(stats) {
  // console.log("o que recebo", stats);
  var stat = Util.extendObject(StatsAppScheme, stats);
  return stat;
}

var StatsAppStore = Util.extendObject(EventEmitter.prototype, {
  get stats() {
    return Util.deepCopy(storeData.stats);
  },
});

AppsStore.on(StatsAppEvents.CHANGE, function () {
  StatsAppStore.emit(StatsAppEvents.CHANGE);
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case StatsAppEvents.REQUEST:
      storeData.stats = processStats(action.data.body.stats);
      StatsAppStore.emit(StatsAppEvents.CHANGE);
      break;
    case StatsAppEvents.REQUEST_ERROR:
      StatsAppStore.emit(
        StatsAppEvents.REQUEST_ERROR,
        action.data.body,
        action.data.status
      );
      break;
  }
});

export default StatsAppStore;
