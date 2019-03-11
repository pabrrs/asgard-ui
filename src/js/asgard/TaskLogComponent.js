/* eslint-disable no-console */
import Bridge from "../helpers/Bridge";
import React from "react/addons";
import config from "../config/config";
import MarathonService from "../plugin/sdk/services/MarathonService";
import DialogActions from "../actions/DialogActions";

const APPEND = 1;
const BLOCK_SIZE = 1024;
let loading = 0;
let topo = 0;

class LogReader {
  constructor(task, logfile, onNewlogDataCallback,
  onNewTopCallback, direction = APPEND) {
    this.bottomOffset = 0;
    this.topOffset = 0;
    this.logData = [];
    this.task = task;
    this.logfile = logfile;
    this.onNewlogDataCallback = onNewlogDataCallback;
    this.onNewTopCallback = onNewTopCallback;
    this.direction = direction;
    this.poll = this.poll.bind(this);
    this.handleReadOK = this.handleReadOK.bind(this);
    this.handleReadTopOK = this.handleReadTopOK.bind(this);
    this.stopPoll = this.stopPoll.bind(this);
    this.startPoll = this.startPoll.bind(this);
    this.startPoll();
  }

  stopPoll() {
    clearInterval(this.intervalId);
  }
  /* eslint-disable max-len */
  startPoll() {
    const url = `tasks/${this.task.id}/files/read?path=${this.logfile}&offset=-1`;
    MarathonService.request({
      resource: url}
    ).success((response) => {
      const totalOffset = response.body.offset;
      this.bottomOffset = totalOffset;
      this.bottomOffset -= Math.min(totalOffset, BLOCK_SIZE);
      this.topOffset = totalOffset;
      this.topOffset -= Math.min(totalOffset, BLOCK_SIZE);
      this.intervalId = setInterval(this.poll, 1000);
    }).error((data) => {
      console.log(`ERROR ${this.task.id}, ${this.logfile}. ${data}`);
    });
  }

  restartPool() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.poll, 1000);
  }

  poll() {
    MarathonService.request({resource:`tasks/${this.task.id}/files/read?path=${this.logfile}&offset=${this.bottomOffset}&length=${BLOCK_SIZE}`})
      .success(this.handleReadOK)
      .error((data) => {
        console.log(`ERROR task ${this.task.id}, ${this.logfile}. ${data}`);
      });
  }

  pollTop() {
    let newLength = BLOCK_SIZE;
    if (this.topOffset < 0) {
      newLength = newLength + this.topOffset;
    }
    if (this.topOffset !== 0) {
      this.topOffset -= BLOCK_SIZE;
      MarathonService.request({resource:`tasks/${this.task.id}/files/read?path=${this.logfile}&offset=${this.topOffset < 0 ? this.topOffset = 0 : this.topOffset }&length=${newLength}`})
      .success(this.handleReadTopOK)
      .error((data) => {
        console.log(`ERROR task ${this.task.id}, ${this.logfile}. ${data}`);
      });
    }
    else {
      topo = 1;
      loading = 1;
    }
  }
  /* eslint-enable */

  handleReadOK(response) {
    const {data} = response.body;
    if (data) {
      this.bottomOffset += data.length;
      this.logData.push(data);
      this.onNewlogDataCallback(this.logData);
    }
  }

  handleReadTopOK(response) {
    const {data} = response.body;
    if (data) {
      this.logData.unshift("\n",data);
      this.onNewTopCallback(this.logData);
    }
  }

};

export default React.createClass({
  displayName: "TaskLogComponent",

  propTypes: {
    logfile: React.PropTypes.string,
    task: React.PropTypes.object
  },

  getInitialState() {
    return {
      logdata: [],
      loadingBottom : false,
      loadingTop : false,
    };
  },
  componentDidMount() {
    const {task, logfile} = this.props;
    this.reader = new LogReader(task, logfile,
    this.onNewlogData, this.onNewTop);
    const el = this.refs && this.refs.logView && this.refs.logView.getDOMNode();
    const ref = this;
    el.addEventListener("scroll", function () {
      // check is scroll top
      if (el.scrollTop === 0) {
        ref.setState ({loadingTop : true});
        ref.reader.pollTop();
        return;
      }
      // scroll not top and bottom
      if (el.scrollTop + el.clientHeight + 2 < el.scrollHeight) {
        ref.reader.stopPoll();
        ref.setState({loadingBottom: false, loadingTop: false});
      }
      // check is scroll bottom
      const isBottom = ref.checkIsBottom(el);
      if (isBottom) {
        el.scrollTop = el.scrollHeight;
        ref.setState ({loadingBottom: true});
        ref.reader.restartPool();
      }
      else {
        ref.setState ({loadingBottom: false});
      }
    });
  },
  componentWillUnmount() {
    this.reader.stopPoll();
  },
  onNewTop(logdata) {
    const el = this.refs && this.refs.logView && this.refs.logView.getDOMNode();
    let prevHeightScroll = el.scrollHeight;
    this.setState({
      logdata: logdata,
    }, () => {
      el.scrollTop = el.scrollHeight - prevHeightScroll;
      if (el.scrollTop === 0) {
        this.setState ({loadingTop: true});
      }
    });
  },
  onNewlogData(logdata) {
    const ref = this.refs;
    this.setState({
      logdata: logdata,
    }, () => {
      const el = ref && ref.logView && ref.logView.getDOMNode();
      el.scrollTop = el.scrollHeight;
    });
  },

  checkIsBottom(el) {
    return Math.round(el.scrollTop + el.clientHeight) >= el.scrollHeight;
  },
  handleDownload() {
    const {task, logfile} = this.props;
    const url = `tasks/${task.id}/files/download?path=${logfile}`;
    MarathonService.request({resource: url}
    ).success((response) => {
      Bridge.navigateTo(`${config.apiURL}${response.body.download_url}`);
    }).error((data) => {
      console.log(`ERROR ${task.id}, ${logfile}. ${data}`);
      DialogActions.alert({message: `Falha ao baixar log: ${data.body}`});
    });
  },
  getLogLines() {
    if (this.reader) {
      return this.reader.logData;
    }
    return [];
  },
  /* eslint-disable max-len */
  render() {
    return(
      <div className="tab-pane">
        <div className="row col-sm-12">
          <button
            className="btn btn-sm btn-default"
            onClick={this.handleDownload}>
            Download
          </button>
        </div>
        <div className="log-view" ref="logView">
          {this.state.loadingTop && loading === 0 ? <i className="icon icon-medium loading"></i> : ""}
          {topo === 1 ? <span>TOPO DO LOG<br></br></span> : ""}
          {this.state.logdata}
        </div>
        {this.state.loadingBottom ? <i className="icon icon-medium loading loading-bottom"></i> : "" }
      </div>
    );
  }
});