import ajaxWrapper from "../../helpers/ajaxWrapper";
import AppDispatcher from "../../AppDispatcher";
import AccountsEvents from "../events/AccountsEvents";
import config from "../../config/config";
import AccountsStore from "../stores/AccountsStore";

var AccountActions = {
  requestToken: function (account) {
    this.request({
      url: `${config.apiURL}accounts/${account}/auth`
    })
      .success(function (account) {
      
        localStorage.setItem("auth_token", account.body.jwt);
        AccountsStore.emit(AccountsEvents.CHANGE);
        // AppDispatcher.dispatch({
        //   actionType: AccountsEvents.REQUEST,
        //   data: account
        // });
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