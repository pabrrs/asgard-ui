import React from "react";
import classNames from "classnames";
import StatsAppStore from "../stores/StatsAppStore";
import StatsAppAction from "../actions/StatsAppActions";
import StatsAppEvents from "../events/StatsAppEvents";
import States from "../../constants/States";

var StatsAppComponent = React.createClass({
  displayName: "StatsAppComponent",

  propTypes: {
    app: React.PropTypes.string,
  },

  getInitialState: function () {
    var stats = StatsAppStore.stats;
    var fetchState = stats.length > 0
    ? States.STATE_SUCCESS
    : States.STATE_LOADING;
    return {
      stats: stats,
      fetchState: fetchState,
    };
  },

  componentWillMount: function () {
    const props = this.props.app;
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

  toggleHelpMenu: function () {
    var props = this.props.app;
    StatsAppAction.requestStats(props);
    this.setState({
      stats: StatsAppStore.stats,
      fetchState: States.STATE_LOADING
    });
  },
  getRamUsage: function () {
    const state = this.state;
    if (state.stats) {
      return state.stats.ram_pct;
    }
  },
  getCpuUsage: function () {
    const state = this.state;
    if (state.stats) {
      return state.stats.cpu_pct;
    }
  },
  getCpuThrUsage: function () {
    const state = this.state;
    if (state.stats) {
      return state.stats.cpu_thr_pct;
    }
  },

  resourceUsage: function () {
    const state = this.state;
    const statsRender = state.fetchState === States.STATE_SUCCESS;

    if (statsRender) {
      return (
        <div className="stats-resources">
          <span className="resources-cpu"> CPU: {this.getCpuUsage()}%</span>
          <span className="resources-ram"> RAM: {this.getRamUsage()}%</span>
          <span className="resources-cpu"> CPU THR:
            {this.getCpuThrUsage()}%</span>
        </div>
      );
    }
    else {
      return (
        <i className="icon icon-large loading loading-bottom"></i>
      );
    }
  },

  render: function () {
    var refreshMenuClassName = classNames("btn btn-lg btn-success");
    return (
      <div className="stats-app">
        <div>
          <h1 className="title-stats">Resource Usage(AVG:60 min)</h1>
          {/* <h2 className="subTitle-stats"></h2> */}
        </div>
        {this.resourceUsage()}
        <div>
          <div className={`${refreshMenuClassName} refresh-stats`}
              onClick={this.toggleHelpMenu}>
            <span className="refresh-stats-span">Refresh</span>
          </div>
        </div>
      </div>
    );
  }
});

export default StatsAppComponent;