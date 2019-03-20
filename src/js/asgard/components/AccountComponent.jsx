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
    return {
      users: users,
      helpMenuVisible: false,
      collapse: false,
      currentAccount: "",
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
    });
  },

  handleClickOutside: function () {
    this.setState({
      helpMenuVisible: false
    });
  },

  toggleHelpMenu: function () {
    this.setState({
      helpMenuVisible: !this.state.helpMenuVisible
    });
  },

  handleClick: function (event) {
    this.setState({collapse: !this.state.collapse});
    event.stopPropagation();
  },

  handleClickToken : function (id) {
    console.log(id);
    MarathonService.request({
      resource: url,
      method: "GET"
    })
    .error (error => {
      console.log(error);
    })
    .success( response => {
      console.log(response);
    });
    Bridge.navigateTo("/#/apps");
  },

  render: function () {
    const accounts = this.state.users && this.state.users.accounts;
    const current = this.state.users.current_account;
    var helpMenuClassName = classNames("help-menu", {
      "active": this.state.helpMenuVisible
    });

    return (
      <div className={helpMenuClassName} style={{opacity: "1", padding: "17px"}}
          onClick={this.toggleHelpMenu}>
        <span>
        {current ? current.name : ""}
        </span>
        <span className="caret"></span>
        <PopoverComponent visible={this.state.helpMenuVisible}
            className="help-menu-dropdown">
          <ul className="dropdown-menu">
            {accounts ? accounts.map(account => {
              return (
                <li key={account.id}><a
                onClick={() => this.handleClickToken(account.id)}>
                {account.name}</a></li>
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
