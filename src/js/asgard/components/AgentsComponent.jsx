import React from "react/addons";
import classNames from "classnames";
import AppListItem from "../../components/AppListItemLabelsComponent";

var AgentsComponent = React.createClass({
  displayName: "AgentsComponent",

  propTypes: {
    model: React.PropTypes.object.isRequired,
    sortKey: React.PropTypes.any,
    total: React.PropTypes.number,
  },

  getInitialState: function () {
    return {
      loading: false,
      collapse: false
    };
  },

  handleClick: function () {
    this.setState({collapse: !this.state.collapse});
  },

  getTdClasses: function (key, classes) {
    var sortKey = this.props.sortKey;

    return classNames(
      "overflow-ellipsis",
      classes,
      {"cell-highlighted": sortKey === key}
    );
  },

  render: function () {
    var model = this.props.model;
    var total = this.props.total;
    var labels = this.props.model.attributes;
    if (labels == null || Object.keys(labels).length === 0) {
      return null;
    }
    var moreLabelClassName = classNames("badge more", {
      visible: Object.keys(model.attributes).length > 3
    });

    return (
      <tr data-toggle="collapse" className="accordion-toggle">
        <span style={{display: "none"}}>{total}</span>
        <td
          className={this.getTdClasses("hostname", "color-base")}
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
                      style={{fontSize: "16px"}}
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
        <td className={this.getTdClasses("total_apps", "col-totalapps1")} title={model.total_apps}>
          {model.total_apps}
        </td>
        <td className={this.getTdClasses("cpu_pct", "col-totalapps2")} title="">
          {model.used_resources.cpus}/{model.resources.cpus} - (
          {model.stats.cpu_pct} % )
        </td>
        <td className={this.getTdClasses("ram_pct","")} title="">
          {model.used_resources.mem}/{model.resources.mem} - (
          {model.stats.ram_pct} % )
        </td>
        <td className={this.getTdClasses("type","col-type")} title={model.type}>
          {model.type}
        </td>
        <td className={this.getTdClasses("version","col-version")} title={model.version}>
          {model.version}
        </td>
      </tr>
    );
  }
});

export default AgentsComponent;
