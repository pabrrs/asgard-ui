import ajaxWrapper from "../../helpers/ajaxWrapper";
import AppDispatcher from "../../AppDispatcher";
import AccountsEvents from "../events/AccountsEvents";
import config from "../../config/config";

var AccountActions = {
  requestToken: function (account) {
    this.request({
      url: `${config.apiURL}accounts/${account}/auth`
    })
      .success(function (account) {
        AppDispatcher.dispatch({
          actionType: AccountsEvents.REQUEST,
          data: account
        });
        localStorage.setItem("auth_token", account.body.jwt);
      })
      .error(function (error) {
        AppDispatcher.dispatch({
          actionType: AccountsEvents.REQUEST_ERROR,
          data: error
        });
      });
  },
  request: ajaxWrapper
};

export default AccountActions;