import ajaxWrapper from "../../helpers/ajaxWrapper";
import AppDispatcher from "../../AppDispatcher";
import UserEvents from "../events/UserEvents";
import config from "../../config/config";

var UserActions = {
  requestUser: function () {
    this.request({
      url: `${config.apiURL}users/me`
    })
      .success(function (users) {
        AppDispatcher.dispatch({
          actionType: UserEvents.REQUEST,
          data: users
        });
      })
      .error(function (error) {
        AppDispatcher.dispatch({
          actionType: UserEvents.REQUEST_ERROR,
          data: error
        });
      });
  },
  request: ajaxWrapper
};

export default UserActions;