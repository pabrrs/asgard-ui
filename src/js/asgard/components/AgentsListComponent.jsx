import React from "react/addons";
import Centered from "../../components/CenteredInlineDialogComponent";
import classNames from "classnames";
import AgentsComponent from "../components/AgentsComponent";
import AgentsStore from "../stores/AgentsStore";
import AgentsEvents from "../events/AgentsEvents";
import States from "../../constants/States";
import lazy from "lazy.js";
import AgentsActions from "../actions/AgentsActions";

// import { runInThisContext } from "vm";

var SlaveListComponent = React.createClass({
  getInitialState: function () {
    var agents = AgentsStore.agents;
    var fetchState = agents.length > 0
    ? States.STATE_SUCCESS
    : States.STATE_LOADING;
    return {
      agents: agents,
      fetchState: fetchState,
      slave: 0,
      query: "",
      activated: false,
      focused: false
    };
  },
  componentWillMount: function () {
    AgentsActions.requestAgents();
    AgentsStore.on(AgentsEvents.CHANGE, this.onAgentsChange);
    AgentsStore.on(AgentsEvents.REQUEST_ERROR, this.onRequestError);
    AgentsStore.on(AgentsEvents.REVERT_ERROR, this.onRevertError);
  },

  componentWillUnmount: function () {
    AgentsStore.removeListener(AgentsEvents.CHANGE,
      this.onDeploymentsChange);
    AgentsStore.removeListener(AgentsEvents.REQUEST_ERROR,
      this.onRequestError);
    AgentsStore.removeListener(AgentsEvents.REVERT_ERROR,
      this.onRevertError);
  },
  onRequestError: function (message, statusCode) {
    var fetchState = States.STATE_ERROR;

    switch (statusCode) {
      case 401:
        fetchState = States.STATE_UNAUTHORIZED;
        break;
      case 403:
        fetchState = States.STATE_FORBIDDEN;
        break;
    }

    this.setState({
      fetchState: fetchState
    });
  },
  onRevertError: function (error) {
    this.setState({
      errorMessage: "Can't revert deployment: " + error.message
    });
  },
  onAgentsChange: function () {
    this.setState({
      agents: AgentsStore.agents,
      fetchState: States.STATE_SUCCESS
    });
  },
  getInlineDialog: function () {
    var state = this.state;
    var pageIsLoading = state.fetchState === States.STATE_LOADING;
    var pageHasNoAgetns = !pageIsLoading &&
        state.agents.length === 0 &&
        state.fetchState !== States.STATE_UNAUTHORIZED &&
        state.fetchState !== States.STATE_FORBIDDEN;

    if (pageIsLoading) {
      let message = "Please wait while agents are being retrieved";
      let title = "Loading Agents...";

      return (
        <Centered>
          <div>
            <i className="icon icon-large loading"></i>
            <h3 className="h3">{title}</h3>
            <p className="muted">{message}</p>
          </div>
        </Centered>
      );
    }
    if (pageHasNoAgetns) {
      return (
        <Centered title="No Agents"
        message="Active deployments will be shown here." />
      );
    }
    return null;
  },
  getAgentsNodes: function () {
    var state = this.state;
    var sortKey = state.sortKey;
    return lazy(state.agents)
      .sortBy(function (agents) {
        return agents[sortKey];
      }, state.sortDescending)
      .map(function (agents) {
        return (
          <AgentsComponent key={agents.id} model={agents} />
        );
      })
      .value();
  },
  blurInputGroup: function () {
    this.setState({
      focused: false,
      activated: this.state.query !== ""
    });
  },
  focusInputGroup: function () {
    this.setState({
      focused: true,
      activated: true
    });
  },
  handleSubmit: function (event) {
    event.preventDefault();
  },
  handleInputChange: function () {
    this.setState ({
      query: this.search.value
    });
  },
  render: function () {
    var searchIconClassSet = classNames("icon ion-search", {
      "clickable": this.state.query !== ""
    });
    var filterBoxClassSet = classNames({
      "input-group": true,
      "filter-box": true,
      "filter-box-activated": !!this.state.activated,
      "space-margin" : true,
    });
    return (
        <div>
          <div style={{display: "flex", justifyContent: "flex-end"}}>
            <div className={`${filterBoxClassSet}`}
                  style={{marginBottom: "7px"}}>
              <span className="input-group-addon" />
              <input className="form-control"
                onBlur={this.blurInputGroup}
                // onChange={this.handleFilterTextChange}
                onFocus={this.focusInputGroup}
                // onKeyDown={this.handleKeyDown}
                placeholder="Filter your agents"
                type="text"
                ref="filterText"
                value={this.state.query} />
              <span className="input-group-addon search-icon-container">
                <i className={searchIconClassSet} onClick={this.handleSubmit} />
              </span>
            </div>
          </div>
        <table className="table table-fixed deployments">
          <colgroup>
            <col style={{width: "18%"}} />
            <col style={{width: "18%"}} />
            <col style={{width: "18%"}} />
            <col style={{width: "18%"}} />
            <col style={{width: "18%"}} />
            <col style={{width: "10%"}} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <span>
                  Hostname
                </span>
              </th>
              <th>
                <span >
                  Qtds de Apps
                </span>
              </th>
              <th>
                <span >
                  CPU(ocupado/total)
                </span>
              </th>
              <th className="">
                <span>
                  RAM(ocupado/total)
                </span>
              </th>
              <th className="">
                <span>
                  Tags
                </span>
              </th>
              <th className="">
                <span>
                  Version
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.getAgentsNodes()}
          </tbody>
        </table>
        {this.getInlineDialog()}
      </div>
    );
  }
});

export default SlaveListComponent;

