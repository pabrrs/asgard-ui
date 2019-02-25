import React from "react/addons";
import classNames from "classnames";
import AppListItem from "../../components/AppListItemLabelsComponent";

var AgentsComponent = React.createClass({
  displayName: "AgentsComponent",

  propTypes: {
    model: React.PropTypes.object.isRequired,
  },

  getInitialState: function () {
    return {
      loading: false,
      collapse: false,
    };
  },

  componentWillMount: function () {
  },

  componentWillUnmount: function () {
  },

  handleClick: function () {
    if (this.state.collapse)
      this.setState({collapse: false});
    else
      this.setState({collapse: true});
  },

  render: function () {
    var model = this.props.model;
    var labels = this.props.model.attributes;
    if (labels == null || Object.keys(labels).length === 0) {
      return null;
    }
    var moreLabelClassName = classNames("badge more", {
      "visible": Object.keys(model.attributes).length > 3
    });
    return (
        <tr data-toggle="collapse"
        className="accordion-toggle">
          <td className="overflow-ellipsis color-base"
          onClick={this.handleClick}
          title={model.hostname}>
            <span className={`triangle-length ${this.state.collapse ?
                  "button-not-collapse" : "button-collapse"}`}>
            </span>
            <span className="col-hostname">{model.hostname}</span>
            <AppListItem numberOfVisibleLabels={3} labels={labels} ref="label">
              <span className={moreLabelClassName} ref="moreLabel">
                &hellip;
              </span>
            </AppListItem>
            {this.state.collapse &&
            <td className="overflow-ellipsis accordion-app">
              <span>
                {model.applications.map(app => {
                  return (
                    <a href={`#/apps/${encodeURIComponent(app.id)}`}
                      style={{fontSize: "16px"}}>
                      {app.id}
                      <br></br>
                    </a>
                  );
                })}
              </span>
            </td>
            }
          </td>
          <td className="overflow-ellipsis col-totalapps"
            title={model.total_apps}>
            {model.total_apps}
          </td>
          <td className="overflow-ellipsis col-totalapps"
            title="">
            {model.used_resources.cpus}/{model.resources.cpus} -
            ({model.stats.cpu_pct} % )
          </td>
          <td className="overflow-ellipsis" title="">
            {model.used_resources.mem}/{model.resources.mem} -
            ({model.stats.ram_pct} % )
          </td>
          <td className="overflow-ellipsis col-type"
              title={model.type}>
            {model.type}
          </td>
          <td className="overflow-ellipsis col-version"
              title={model.version}>
            {model.version}
          </td>
        </tr>
    );
  }
});

export default AgentsComponent;
