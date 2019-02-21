import classNames from "classnames";
import React from "react/addons";

var AgentsComponent = React.createClass({
  displayName: "AgentsComponent",

  propTypes: {
    model: React.PropTypes.object.isRequired,
  },

  getInitialState: function () {
    return {
      loading: false,
      continueButtonsLoadingState: {},
      collapse: false,
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

  handleClick: function () {
    if (this.state.collapse)
      this.setState({collapse: false});
    else
      this.setState({collapse: true});
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
        <tr data-toggle="collapse" data-target="#demo1"
        className="accordion-toggle">
          <td className="overflow-ellipsis" onClick={this.handleClick}
          title={model.hostname} style={{color: "white"}}>
            <span className={`${this.state.collapse ?
                  "button-not-collapse" : "button-collapse"}`}
                  style={{height: "15px", marginRight: "10px"}}>
            </span>
            {model.hostname}
            {this.state.collapse &&
            <td className="overflow-ellipsis"
                style={{paddingTop: "20px", paddingLeft: "30px"}}>
              <span style={{color: "#898d98"}}>
                Total de Apps: {model.total_apps}
              </span>
            </td>
            }
          </td>
          <td className="overflow-ellipsis" title="">
            {model.total_apps}
          </td>
          <td className="overflow-ellipsis" title="">
            {model.used_resources.cpus}/{model.resources.cpus} -
            ({model.stats.cpu_pct} % )
          </td>
          <td className="overflow-ellipsis" title="">
            {model.used_resources.mem}/{model.resources.mem} -
            ({model.stats.ram_pct} % )
          </td>
          <td className="overflow-ellipsis" title={model.type}>
            {model.type}
          </td>
          <td className="overflow-ellipsis" title={model.version}>
            {model.version}
          </td>
        </tr>
    );
  }
});

export default AgentsComponent;
