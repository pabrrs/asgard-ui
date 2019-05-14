import React from "react";

import Util from "../helpers/Util";
import PropTypeUtil from "../helpers/PropTypeUtil";
import MenuItemComponent from "../components/MenuItemComponent";

var MenuComponent = React.createClass({
  "displayName": "MenuComponent",

  propTypes: {
    children: PropTypeUtil.oneOrManyInstancesOf(MenuItemComponent),
    className: React.PropTypes.string,
    onChange: React.PropTypes.func,
    selected: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      onChange: Util.noop
    };
  },

  getInitialState:  function () {
    return {
      name: "menu-" + Util.getUniqueId(),
    };
  },

  renderChildren: function () {
    var {children, selected} = this.props;
    var {name} = this.state;

    return React.Children.map(children,  (child) =>
      React.cloneElement(child, {
        name: name,
        selected: child.props.value === selected
      })
    );
  },

  onChange: function (event) {
    this.props.onChange(event.target.value);
  },

  render: function () {
    return (
      <ul onChange={this.onChange} role="menu" className={this.props.className}>
        {this.renderChildren()}
      </ul>
    );
  }
});

export default MenuComponent;
