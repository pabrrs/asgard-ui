import React from "react/addons";
import {Link} from "react-router";
import classNames from "classnames";
import PopoverComponent from "./PopoverComponent";
import OnClickOutsideMixin from "react-onclickoutside";

var ConfigsComponent = React.createClass({
  displayName: "HelpMenuComponent",

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [OnClickOutsideMixin],

  getInitialState: function () {
    return {
      helpMenuVisible: false,
      collapse: false,
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

  handleClick: function (event) {
    this.setState({collapse: !this.state.collapse});
    event.stopPropagation();
  },
  render: function () {
    var router = this.context.router;
    var helpMenuClassName = classNames("help-menu", {
      "active": this.state.helpMenuVisible
    });

    return (
      <div className={helpMenuClassName}
          onClick={this.toggleHelpMenu}>
        <i className="icon icon-mini settings"></i>
        <span className="caret"></span>
        <PopoverComponent visible={this.state.helpMenuVisible}
            className="help-menu-dropdown">
          <ul className="dropdown-menu">
            <li>
              <a>
                Configurações
              </a>
            </li>
            {/* <li>
              <a style={{display: "flex", justifyContent: "space-between"}}
              onClick={this.handleClick}>
                Accounts
                <span className={`triangle-length ${this.state.collapse ?
                  "button-not-collapse" : "button-collapse"}`}>
                </span>
              </a>
              {this.state.collapse ? <ul>
                <li className="testeHover" style={{paddingBottom: '5px'}}><a style={{color: '#333'}}>Lucas Domingues @B2W/Dev</a></li>
                <li className="testeHover" style={{paddingBottom: '5px'}}><a style={{color: '#333'}}>Lucas Domingues @ASGARD/Dev</a></li>
                <li className="testeHover" style={{paddingBottom: '5px'}}><a style={{color: '#333'}}>Lucas Domingues @ADS/Dev</a></li>
              </ul> : ""}
            </li> */}
            <li>
              <a href="https://mesosphere.github.io/marathon/docs/"
                  target="_blank">
                Logout
              </a>
            </li>
          </ul>
        </PopoverComponent>
      </div>
    );
  }
});

export default ConfigsComponent;
