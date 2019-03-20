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
    var opts = {
      "Authorization" : "Token 1899c4f092ba4ad997603fb52a460ed8",
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-UI-Version": "new",
    };
    const url = `${config.apiURL}accounts/${id}/auth`;
    fetch(url, {
      method: 'get',
      headers: opts,
    })
    .then(function(response) { 
      console.log(response.headers);
    })
    .catch(function(err) { 
      console.error(err); 
    });

    // fetch(url, opts).then(function (response) {
    //   return response();
    // })
    // .then(function (body) {
    //   console.log(body);
    // });
    // MarathonService.request({
    //   resource: url,
    //   method: "GET"
    // })
    // .error (error => {
    //   console.log(error);
    // })
    // .success( (response, um, dois) => {
    //   // this.setState({
    //   //   users: response.body.users,.
    //   // });
    //   // console.log(response);
    //   console.log(response);
    //   // console.log("PRIMEIRO ->"+"\n",response.body.users+"\n");
    //   // console.log("SEGUNDO ->"+"\n",response.body.current_account+"\n");
    //   // localStorage.setItem("auth_token", response.body.jwt_token);
    // });
    // Bridge.navigateTo("/#/apps");
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
