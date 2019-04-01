import React from "react/addons";
import classNames from "classnames";
import OnClickOutsideMixin from "react-onclickoutside";
import StatsAppStore from "../stores/StatsAppStore";
import StatsAppAction from "../actions/StatsAppActions";
import StatsAppEvents from "../events/StatsAppEvents";
import States from "../../constants/States";

var StatsAppComponent = React.createClass({
  displayName: "StatsAppComponent",

  contextTypes: {
    app: React.PropTypes.string,
    router: React.PropTypes.func,
  },

  mixins: [OnClickOutsideMixin],

  getInitialState: function () {
    var stats = StatsAppStore.stats;
    var fetchState = stats.length > 0
    ? States.STATE_SUCCESS
    : States.STATE_LOADING;
    return {
      stats: stats,
      helpMenuVisible: false,
      fetchState: fetchState,
    };
  },

  componentWillMount: function () {
    var props = this.props.app;
    StatsAppAction.requestStats(props);
    StatsAppStore.on(StatsAppEvents.CHANGE, this.onStatsChange);
  },

  componentWillUnmount: function () {
    StatsAppStore.removeListener(StatsAppEvents.CHANGE,
      this.onStatsChange);
  },

  onStatsChange: function () {
    this.setState({
      stats: StatsAppStore.stats,
      fetchState: States.STATE_SUCCESS
    });
  },

  handleClickOutside: function () {
    this.setState({
      helpMenuVisible: false
    });
  },

  toggleHelpMenu: function () {
    var props = this.props.app;
    StatsAppAction.requestStats(props);
    this.setState({
      helpMenuVisible: !this.state.helpMenuVisible,
      stats: StatsAppStore.stats,
      fetchState: States.STATE_LOADING
    });
  },

  render: function () {
    var refreshMenuClassName = classNames("btn btn-lg btn-success");
    return (
      <div className="stats-app">
      <h1>Resources application</h1>
      {this.state.fetchState === States.STATE_SUCCESS && this.state.stats.ram_pct && this.state.stats.cpu_pct ?
        <div className="stats-resources">
          <span className="resources-cpu"> CPU Usage : {this.state.stats && this.state.stats.cpu_pct}%</span>
          <span className="resources-ram"> RAM Usage : {this.state.stats && this.state.stats.ram_pct}%</span>
        </div>:
        <i className="icon icon-large loading loading-bottom"></i>
      }
      <div>
        <div className={`${refreshMenuClassName} refresh-stats`}
            onClick={this.toggleHelpMenu}>
          <span className="refresh-stats-span"> Refresh</span>
        </div>
      </div>
    </div>
    );
  }
});

export default StatsAppComponent;
