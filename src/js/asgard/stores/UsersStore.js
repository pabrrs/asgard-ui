import {EventEmitter} from "events";

import AppDispatcher from "../../AppDispatcher";
import AppsStore from "../../stores/AppsStore";
// import AppsEvents from "../events/UserEvents";
import UserEvents from "../events/UserEvents";
// import UserEvents from "./schemes/AgentsScheme";
import UserScheme from "./schemes/UserScheme";
import Util from "../../helpers/Util";

const storeData = {
  users: [],
};

function processUsers(users) {
  var user = Util.extendObject(UserScheme, users);
  return user;
}

var UserStore = Util.extendObject(EventEmitter.prototype, {
  get users() {
    return Util.deepCopy(storeData.users);
  },
});

AppsStore.on(UserEvents.CHANGE, function () {
  UserStore.emit(UserEvents.CHANGE);
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case UserEvents.REQUEST:
      storeData.users = processUsers(action.data.body);
      storeData.total = action.data.body;
      UserStore.emit(UserEvents.CHANGE);
      break;
    case UserEvents.REQUEST_ERROR:
      UserStore.emit(
        UserEvents.REQUEST_ERROR,
        action.data.body,
        action.data.status
      );
      break;
  }
});

export default UserStore;
