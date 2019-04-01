import React from "react/addons";
import classNames from "classnames";
import OnClickOutsideMixin from "react-onclickoutside";
import StatsAppStore from "../stores/StatsAppStore";
import StatsAppAction from "../actions/StatsAppActions";
import StatsAppEvents from "../events/StatsAppEvents";

var StatsAppComponent = React.createClass({
  displayName: "ComponentStatsApp",

  contextTypes: {
    app: React.PropTypes.string,
    router: React.PropTypes.func,
  },

  mixins: [OnClickOutsideMixin],

  getInitialState: function () {
    var stat = StatsAppStore.stats;
    return {
      stats: stat,
      helpMenuVisible: false,
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
    });
  },

  render: function () {
    var refreshMenuClassName = classNames("btn btn-lg btn-success");
    console.log("meu render",this.state.stats && this.state.stats.ram_pct);
    return (
      <div style={{display: "flex",
        flexDirection: "column", alignItems: "center"}}>
      <h1>Resources application</h1>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px"}}>
          <span style={{fontSize: "17px"}}>CPU Usage : {this.state.stats && this.state.stats.cpu_pct}%</span>
          <span style={{fontSize: "17px"}}>RAM Usage : {this.state.stats && this.state.stats.ram_pct}%</span>
      </div>
      <div>
        <div className={`${refreshMenuClassName}`} style={{textAlign: "center", padding: "8px 16px", marginTop: "20px"}}
            onClick={this.toggleHelpMenu}>
          <span style={{color: "white", backgroundColor: "transparent"}}>Refresh</span>
        </div>
      </div>
    </div>
    );
  }
});

export default StatsAppComponent;
