import React from "react/addons";
import Centered from "../../components/CenteredInlineDialogComponent";
import classNames from "classnames";
import AgentsComponent from "../components/AgentsComponent";
import AgentsStore from "../stores/AgentsStore";
import AgentsEvents from "../events/AgentsEvents";
import States from "../../constants/States";
import lazy from "lazy.js";
import AgentsActions from "../actions/AgentsActions";
import ConcatFilter from "../helpers/concatFilters";

var SlaveListComponent = React.createClass({
  displayName: "AgentsListComponent",

  getInitialState: function() {
    var agents = AgentsStore.agents;
    var total = AgentsStore.total;
    var totalApps = AgentsStore.length;
    var fetchState =
      agents.length > 0 ? States.STATE_SUCCESS : States.STATE_LOADING;
    return {
      agents: agents,
      fetchState: fetchState,
      slave: 0,
      filterText: "",
      activated: false,
      focused: false,
      total: total,
      length: totalApps,
    };
  },
  componentWillMount: function() {
    AgentsActions.requestAgents();
    AgentsStore.on(AgentsEvents.CHANGE, this.onAgentsChange);
    AgentsStore.on(AgentsEvents.FILTER, this.requestAgents);
  },

  componentWillUnmount: function() {
    AgentsStore.removeListener(AgentsEvents.CHANGE, this.onAgentsChange);
    AgentsStore.removeListener(AgentsEvents.FILTER, this.requestAgents);
    AgentsActions.setFilter("");
  },
  onAgentsChange: function() {
    this.setState({
      agents: AgentsStore.agents,
      total: AgentsStore.total,
      fetchState: States.STATE_SUCCESS,
      length: AgentsStore.agents.length,
    });
  },
  getInlineDialog: function() {
    var state = this.state;
    var pageIsLoading = state.fetchState === States.STATE_LOADING;
    var pageHasNoAgents =
      !pageIsLoading &&
      state.agents.length === 0 &&
      state.fetchState !== States.STATE_UNAUTHORIZED &&
      state.fetchState !== States.STATE_FORBIDDEN;

    if (pageIsLoading) {
      let message = "Please wait while agents are being retrieved";
      let title = "Loading Agents...";

      return (
        <Centered>
          <div>
            <i className="icon icon-large loading" />
            <h3 className="h3">{title}</h3>
            <p className="muted">{message}</p>
          </div>
        </Centered>
      );
    }
    if (pageHasNoAgents) {
      return (
        <Centered
          title="No Agents"
          message="Cluster Agents will be shown here"
        />
      );
    }
    return null;
  },
  getAgentsNodes: function () {
    var state = this.state;
    var sortKey = state.sortKey;
    var length = state.length;
    return lazy(state.agents)
      .sortBy(function (agents) {
        return agents[sortKey];
      }, state.sortDescending)
      .map(function (agents) {
        return <AgentsComponent total={length} key={agents.id} model={agents} />;
      })
      .value();
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var filterText = this.state.filterText;
    var changeFilter = ConcatFilter.format(filterText);
    AgentsActions.setFilter(changeFilter);
  },
  requestAgents: function () {
    AgentsActions.requestAgents();
  },
  handleKeyDown: function(event) {
    switch (event.key) {
      case "Escape":
        event.target.blur();
        this.handleClearFilterText();
        break;
      case "Enter":
        this.handleSubmit(event);
        break;
    }
  },
  focusInputGroup: function() {
    this.setState({
      focused: true,
      activated: true
    });
  },
  handleFilterTextChange: function(event) {
    var filterText = event.target.value;
    this.setState({ filterText }, () => {
      if (filterText == null || filterText === "") {
        this.handleClearFilterText();
      }
    });
  },

  handleClick: function() {
    this.setState({ filterText: "" });
    AgentsActions.setFilter("");
    this.getInlineDialog();
  },

  blurInputGroup: function() {
    this.setState({
      focused: false,
      activated: this.state.filterText !== ""
    });
  },
  render: function() {
    var totalUsedCpu = this.state.total.stats && this.state.total.stats.cpu_pct;
    var totalUsedRam = this.state.total.stats && this.state.total.stats.ram_pct;
    var totalAgents = this.state.length;

    var searchIconClassSet = classNames("icon ion-search", {
      clickable: this.state.query !== ""
    });
    var filterBoxClassSet = classNames({
      "input-group": true,
      "filter-box": true,
      "filter-box-activated": !!this.state.activated,
      "space-margin": true
    });
    return (
      <div>
        <div className="sub-header-total">
            <span className="totalAgents">Total: {totalAgents}</span>
            <span className="used-total">
              CPU: {totalUsedCpu}% - RAM: {totalUsedRam}
            </span>
          <div className={`${filterBoxClassSet} search-input`}>
            <span className="input-group-addon" />
            <input
              className="form-control"
              onBlur={this.blurInputGroup}
              onChange={this.handleFilterTextChange}
              onFocus={this.focusInputGroup}
              onKeyDown={this.handleKeyDown}
              placeholder="Filter your agents"
              type="text"
              ref="filterText"
              value={this.state.filterText}
            />
            <span className="input-group-addon search-icon-container">
              <i className={searchIconClassSet} onClick={this.handleSubmit} />
            </span>
          </div>
          <button
            className="btn btn-xs btn-danger btn-settings button-filter"
            onClick={this.handleClick}
          >
            Clear filter
          </button>
        </div>
        <table className="table deployments">
          <colgroup>
            <col style={{ width: "46%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <span>Hostname</span>
              </th>
              <th>
                <span>Apps</span>
              </th>
              <th>
                <span>CPU(ocupado/total)</span>
              </th>
              <th>
                <span>RAM(ocupado/total)</span>
              </th>
              <th>
                <span>Type</span>
              </th>
              <th>
                <span>Agent Version</span>
              </th>
            </tr>
          </thead>
          <tbody>{this.getAgentsNodes()}</tbody>
        </table>
        {this.getInlineDialog()}
      </div>
    );
  }
});

export default SlaveListComponent;
