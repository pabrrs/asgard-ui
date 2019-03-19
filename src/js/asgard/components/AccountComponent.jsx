import React from "react/addons";
import classNames from "classnames";
import PopoverComponent from "./PopoverComponent";
import UserActions from "../actions/UserActions";
import OnClickOutsideMixin from "react-onclickoutside";
import UserStore from "../stores/UsersStore";
import PluginStore from "../../stores/PluginStore";
import UserEvents from "../events/UserEvents";
import PluginEvents from "../../events/PluginEvents";
var AccountComponent = React.createClass({
  displayName: "AccountComponent",

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [OnClickOutsideMixin],

  getInitialState: function () {
    var users = UserStore.users;
    var total = UserStore.total;
    return {
      users: users,
      total: total,
      helpMenuVisible: false,
      collapse: false,
    };
  },

  componentWillMount: function () {
    // UserActions.requestUser();
    UserStore.on(UserEvents.CHANGE, this.onRequestUser);
    PluginStore.on(PluginEvents.CHANGE, this.getUserRequest);
  },

  componentWillUnmount: function () {
    UserStore.removeListener(UserEvents.CHANGE,
      this.onRequestUser);
  },

  getUserRequest: function () {
    if (PluginStore.isPluginsLoadingFinished) {
      UserActions.requestUser();
    }
  },

  onRequestUser: function () {
    this.setState( {
      users : UserStore.users,
      total: UserStore.total,
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
  render: function () {
    var name = this.state.users && this.state.users.name;
    var current;
    var accounts = [];
    if (PluginStore.isPluginsLoadingFinished) {
      accounts = this.state.users.accounts;
      current = this.state.users.current_account.name;
    }
    var router = this.context.router;
    var helpMenuClassName = classNames("help-menu", {
      "active": this.state.helpMenuVisible
    });

    return (
      <div className={helpMenuClassName} style={{opacity: "1", padding: "17px"}}
          onClick={this.toggleHelpMenu}>
        <span>{name}
        @
        {current}
        </span>
        <span className="caret"></span>
        <PopoverComponent visible={this.state.helpMenuVisible}
            className="help-menu-dropdown">
          <ul className="dropdown-menu">
            {accounts.map(account => {
              return (
                <li key={account.id}><a>{account.name}</a></li>
              );
            })}
          </ul>
        </PopoverComponent>
      </div>
    );
  }
});

export default AccountComponent;
