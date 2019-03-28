import React from "react/addons";
import {Link} from "react-router";
import classNames from "classnames";
import PopoverComponent from "../../components/PopoverComponent";
import OnClickOutsideMixin from "react-onclickoutside";

var ComponentStatsApp = React.createClass({
  displayName: "ComponentStatsApp",

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [OnClickOutsideMixin],

  getInitialState: function () {
    return {
      helpMenuVisible: false
    };
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

  render: function () {
    var router = this.context.router;
    var helpMenuClassName = classNames("btn btn-lg btn-default help-menu", {
      "active": this.state.helpMenuVisible
    });
    return (
      <div style={{display: "flex",
      flexDirection: "column", alignItems: "center"}}>
      <h1>Stats app - 30 min</h1>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px"}}>
          <span style={{fontSize: "17px"}}>CPU Usage : 50%</span>
          <span style={{fontSize: "17px"}}>RAM Usage : 40%</span>
      </div>
      <div className={`${helpMenuClassName}`} style={{textAlign: "center", padding: "8px 16px"}}
          onClick={this.toggleHelpMenu}>
        <span style={{color: "white", backgroundColor: "transparent"}}>Time config</span>
        <span className="caret"></span>
        <PopoverComponent visible={this.state.helpMenuVisible} dropdownApps
            className="help-menu-dropdown">
          <ul className="dropdown-menu" style={{minWidth: "120px"}}>
            <li>
              <span>
                30 min
              </span>
            </li>
            <li>
              <span>
                60 min
              </span>
            </li>
            <li>
              <span>
                90 min
              </span>
            </li>
          </ul>
        </PopoverComponent>
        </div>
      </div>
    );
  }
});

export default ComponentStatsApp;
