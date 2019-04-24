import React from "react/addons";
import classNames from "classnames";
import AppListItem from "../../components/AppListItemLabelsComponent";

var AgentsComponent = React.createClass({
  displayName: "AgentsComponent",

  propTypes: {
    model: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      loading: false,
      collapse: false
    };
  },

  handleClick: function() {
    this.setState({ collapse: !this.state.collapse });
  },

  render: function() {
    var sortKey = this.props.sortKey;
    var model = this.props.model;
    var labels = this.props.model.attributes;
    if (labels == null || Object.keys(labels).length === 0) {
      return null;
    }
    var moreLabelClassName = classNames("badge more", {
      visible: Object.keys(model.attributes).length > 3
    });
    var hostnameClassSet = classNames(
      " overflow-ellipsis color-base text-left name-cell",
      {
        "cell-highlighted": sortKey === "hostname"
      }
    );
    var total_appsClassSet = classNames(
      "overflow-ellipsis col-totalapps1 text-left name-cell",
      {
        "cell-highlighted": sortKey === "total_apps"
      }
    );

    var cpuClassSet = classNames(
      "overflow-ellipsis col-totalapps2 text-left cpu-cell",
      {
        "cell-highlighted": sortKey === "cpu_pct"
      }
    );

    var memClassSet = classNames("overflow-ellipsis text-left ram-cell", {
      "cell-highlighted": sortKey === "ram_pct"
    });
    var typeClassSet = classNames(
      "overflow-ellipsis col-type text-left name-cell",
      {
        "cell-highlighted": sortKey === "type"
      }
    );
    var versionClassSet = classNames(
      "overflow-ellipsis col-version text-left name-cell",
      {
        "cell-highlighted": sortKey === "version"
      }
    );
    return (
      <tr data-toggle="collapse" className="accordion-toggle">
        <td
          className={hostnameClassSet}
          onClick={this.handleClick}
          title={model.hostname}
        >
          <span
            className={`triangle-length  ${
              this.state.collapse ? "button-not-collapse" : "button-collapse"
            }`}
          />
          <span className="col-hostname">{model.hostname}</span>
          <AppListItem numberOfVisibleLabels={3} labels={labels} ref="label">
            <span className={moreLabelClassName} ref="moreLabel">
              &hellip;
            </span>
          </AppListItem>
          {this.state.collapse && (
            <td className="overflow-ellipsis accordion-app">
              <span>
                {model.applications.map(app => {
                  return (
                    <a
                      href={`#/apps/${encodeURIComponent("/" + app.id)}`}
                      style={{ fontSize: "16px" }}
                    >
                      {app.id}
                      <br />
                    </a>
                  );
                })}
              </span>
            </td>
          )}
        </td>
        <td className={total_appsClassSet} title={model.total_apps}>
          {model.total_apps}
        </td>
        <td className={cpuClassSet} title="">
          {model.used_resources.cpus}/{model.resources.cpus} - (
          {model.stats.cpu_pct} % )
        </td>
        <td className={memClassSet} title="">
          {model.used_resources.mem}/{model.resources.mem} - (
          {model.stats.ram_pct} % )
        </td>
        <td className={typeClassSet} title={model.type}>
          {model.type}
        </td>
        <td className={versionClassSet} title={model.version}>
          {model.version}
        </td>
      </tr>
    );
  }
});

export default AgentsComponent;
