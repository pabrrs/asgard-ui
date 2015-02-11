/** @jsx React.DOM */

var React = require("react/addons");

var AppBreadcrumbsComponent = React.createClass({
  displayName: "AppBreadcrumbsComponent",

  propTypes: {
    activeTask: React.PropTypes.object,
    activeViewIndex: React.PropTypes.number.isRequired,
    model: React.PropTypes.object.isRequired,
    onDestroy: React.PropTypes.func.isRequired,
    showTaskList: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      activeViewIndex: 0
    };
  },

  render: function () {
    var model = this.props.model;
    var activeViewIndex = this.props.activeViewIndex;
    var appName = model.get("id");

    var taskName;
    if (activeViewIndex === 1 && this.props.activeTask != null) {
      taskName = this.props.activeTask.get("id");
    }

    var activeAppClassSet = React.addons.classSet({
      "active": true,
      "hidden": activeViewIndex === 1
    });
    var inactiveAppClassSet = React.addons.classSet({
      "hidden": activeViewIndex === 0
    });
    var taskClassSet = React.addons.classSet({
      "active": true,
      "hidden": activeViewIndex === 0
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <ol className="breadcrumb">
        <li key="apps">
          <a href="#" onClick={this.props.onDestroy}>Apps</a>
        </li>
        <li className={activeAppClassSet}>
          {appName}
        </li>
        <li className={inactiveAppClassSet}>
          <a href="#" onClick={this.props.showTaskList}>
            {appName}
          </a>
        </li>
        <li className={taskClassSet} key="task">
          {taskName}
        </li>
      </ol>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  }
});

module.exports = AppBreadcrumbsComponent;
