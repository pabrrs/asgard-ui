import classNames from "classnames";
import {Link} from "react-router";
import React from "react/addons";

import AppsStore from "../../stores/AppFormStore";
import AgentsStore from "../stores/AgentsStore";
import AgentsActions from "../actions/AgentsActions";
import DeploymentEvents from "../events/AgentsEvents";
import DialogActions from "../../actions/DialogActions";
import DialogStore from "../../stores/DialogStore";
import DialogSeverity from "../../constants/DialogSeverity";

var AgentsComponent = React.createClass({
  displayName: "AgentsComponent",

  propTypes: {
    model: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      loading: false,
      continueButtonsLoadingState: {}
    };
  },

  componentWillMount: function () {
  },

  componentWillUnmount: function () {
  },

  getContinueButton: function (action) {
    if (!action.isWaitingForUserAction) {
      return null;
    }

    let continueButtonClasses = classNames("btn btn-xs btn-success", {
      disabled: !!this.state.continueButtonsLoadingState[action.app]
    });

    return (
      <button onClick={this.handleContinueMigration.bind(this, action.app)}
          className={continueButtonClasses}>
        Continue
      </button>
    );
  },

  getButtons: function () {
    if (this.state.loading) {
      return (<div className="loading-bar" />);
    } else {
      return (
        <ul className="list-inline">
          <li>
            <button
                onClick={this.handleRevertDeployment}
                className="btn btn-xs btn-default">
              Rollback
            </button>
          </li>
        </ul>
      );
    }
  },

  render: function () {
    var model = this.props.model;
    return (
      <tr>
        <td className="overflow-ellipsis"
        title={model.hostname} style={{color: "white"}}>
          {model.hostname}
        </td>
        <td className="overflow-ellipsis" title="">
          10
        </td>
        <td className="overflow-ellipsis" title="cpus">
          {model.used_resources.cpus}/{model.resources.cpus} -
          ( {(model.used_resources.cpus/model.resources.cpus) * 100} % )
        </td>
        <td className="overflow-ellipsis" title="mem">
          {model.used_resources.mem}/{model.resources.mem} -
          ({(model.used_resources.mem/model.resources.mem) * 100} % )
        </td>
        <td className="overflow-ellipsis" title={model.tags}>
          {model.tags}
        </td>
        <td className="overflow-ellipsis" title={model.version}>
          {model.version}
        </td>
      </tr>
    );
  }
});

export default AgentsComponent;
