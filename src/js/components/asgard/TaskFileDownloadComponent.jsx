import React from "react/addons";

import config from "../../config/config";
import Bridge from "../../helpers/Bridge";
import DialogActions from "../../actions/DialogActions";
import MarathonService from "../../plugin/sdk/services/MarathonService";

import MesosEvents from "../../events/MesosEvents";
import MesosStore from "../../stores/MesosStore";

var TaskFileDownloadComponent = React.createClass({
  displayName: "TaskFileDownloadComponent",

  propTypes: {
    className: React.PropTypes.string,
    fileName: React.PropTypes.string.isRequired,
    task: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      file: this.getFile(),
      fileIsRequestedByUser: false,
      fileRequestFailed: false
    };
  },

  componentWillUnmount: function () {
    MesosStore.removeListener(MesosEvents.REQUEST_TASK_FILES_COMPLETE,
      this.onMesosRequestTaskFilesComplete);
    MesosStore.removeListener(MesosEvents.REQUEST_TASK_FILES_ERROR,
      this.onMesosRequestTaskFilesError);
  },

  getFile: function () {
    var props = this.props;
    var task = props.task;
    var files = MesosStore.getTaskFiles(task.id);

    if (files != null && files.length) {
      return files.filter(file => file.name === props.fileName)[0];
    }

    return null;
  },

  onMesosRequestTaskFilesComplete: function (request) {
    if (!request || request.taskId !== this.props.task.id) {
      return;
    }

    let file = this.getFile();
    let fileIsRequestedByUser = this.state.fileIsRequestedByUser;

    MesosStore.removeListener(MesosEvents.REQUEST_TASK_FILES_COMPLETE,
      this.onMesosRequestTaskFilesComplete);
    MesosStore.removeListener(MesosEvents.REQUEST_TASK_FILES_ERROR,
      this.onMesosRequestTaskFilesError);

    if (file != null && fileIsRequestedByUser) {
      window.open(file.downloadURI);
      fileIsRequestedByUser = false;
    }

    this.setState({
      file: file,
      fileIsRequestedByUser: fileIsRequestedByUser,
      fileRequestFailed: false
    });

  },

  onMesosRequestTaskFilesError: function (request) {
    if (!request || request.taskId !== this.props.task.id) {
      return;
    }

    MesosStore.removeListener(MesosEvents.REQUEST_TASK_FILES_COMPLETE,
      this.onMesosRequestTaskFilesComplete);
    MesosStore.removeListener(MesosEvents.REQUEST_TASK_FILES_ERROR,
      this.onMesosRequestTaskFilesError);

    this.setState({
      fileIsRequestedByUser: false,
      fileRequestFailed: true
    });
  },

  /* eslint-disable no-unused-vars */
  handleClick: function (event) {
    event.preventDefault();
    const {task, fileName} = this.props;
    const url = `tasks/${task.id}/files/download?path=${fileName}`;

    MarathonService.request({resource: url}
    ).success((response) => {
      MarathonService.request(
        {resource: `${response.body.download_url}`}
      ).success((r) => {
        Bridge.navigateTo(`${config.apiURL}${response.body.download_url}`);
      }).error((data) => {
        DialogActions.alert({message: `Log Indisponivel.`});
      });
    }).error((data) => {
      console.log(`ERROR ${task.id}, ${fileName}. ${data.body}`);
      DialogActions.alert({message: `Falha ao baixar log: ${data.body}`});
    });
  },
  /* eslint-enable no-unused-vars */

  render: function () {
    var props = this.props;
    var name = props.fileName;

    return (
        <button
            className="btn btn-sm btn-default"
            onClick={this.handleClick}>
          Download {name}
        </button>
    );
  }
});

export default TaskFileDownloadComponent;
