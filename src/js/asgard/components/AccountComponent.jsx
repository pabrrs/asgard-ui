import React from "react/addons";
import classNames from "classnames";
import PopoverComponent from "./PopoverComponent";
import UserActions from "../actions/UserActions";
import OnClickOutsideMixin from "react-onclickoutside";
import UserStore from "../stores/UsersStore";
import PluginStore from "../../stores/PluginStore";
import UserEvents from "../events/UserEvents";
import Bridge from "../../helpers/Bridge";
import MarathonService from "../../plugin/sdk/services/MarathonService";
import config from "../../config/config";

var AccountComponent = React.createClass({
  displayName: "AccountComponent",

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [OnClickOutsideMixin],

  getInitialState: function () {
    var users = UserStore.users;
    var currents = UserStore.users.current_account;
    var accountList = UserStore.users.accounts;
    return {
      users: users,
      helpMenuVisible: false,
      collapse: false,
      currentAccount: currents,
      listAccounts : accountList,
    };
  },

  componentWillMount: function () {
    UserActions.requestUser();
    UserStore.on(UserEvents.CHANGE, this.onRequestUser);
  },

  componentWillUnmount: function () {
    UserStore.removeListener(UserEvents.CHANGE,
      this.onRequestUser);
  },

  onRequestUser: function () {
    this.setState( {
      users : UserStore.users,
      currentAccount : UserStore.users.current_account,
      listAccounts: UserStore.users.accounts,
    });
  },

  handleClickOutside: function () {
    this.setState({
      helpMenuVisible: false
    });
  },

  toggleHelpMenu: function () {
    this.setState({
      helpMenuVisible: !this.state.helpMenuVisible,
    });
  },

  handleClick: function (event) {
    this.setState({collapse: !this.state.collapse});
    event.stopPropagation();
  },

  handleClickToken : function (accountClick, accounts, current) {
    MarathonService.request({
      resource: `accounts/${accountClick.id}/auth`,
      method: "GET"
    })
    .error (error => {
      console.log(error);
    })
    .success( response => {
      const accountsList = accounts;
      accountsList.push(current);
      const accountsAppend = accountsList.filter(list => {
        return list.id !== accountClick.id;
      });
      this.setState({
        listAccounts: accountsAppend,
        currentAccount: accountClick,
      });
      localStorage.setItem("auth_token", response.body.jwt);
    });
    Bridge.navigateTo("/#/apps");
  },

  render: function () {
    const accounts = this.state.listAccounts;
    const myAccounts = this.state.users && this.state.users.accounts;
    const current = this.state.currentAccount;
    var helpMenuClassName = classNames("help-menu", {
      "active": this.state.helpMenuVisible
    });

    return (
      <div className={helpMenuClassName} style={{opacity: "1", padding: "17px"}}
          onClick={() => this.toggleHelpMenu(myAccounts)}
          >
        <span>
        {current ? current.name : ""}
        </span>
        <span className="caret"></span>
        <PopoverComponent visible={this.state.helpMenuVisible}
            className="help-menu-dropdown">
          <ul className="dropdown-menu">
            {accounts ? accounts.map(account => {
              return (
                <li key={account.id}>
                  <a
                  // onClick={() => this.handleClickToken(account, accounts, current)}
                  >
                    {account.name}
                  </a>
                </li>
              );
            }): ""
            }
          </ul>
        </PopoverComponent>
      </div>
    );
  }
});

export default AccountComponent;
