import Bridge from "../helpers/Bridge";
import React from "react/addons";
import config from "../../../config/config";
import MarathonService from "../plugin/sdk/services/MarathonService";
import DialogActions from "../actions/DialogActions";

const APPEND = 1;
const BLOCK_SIZE = 512;
let loading = 0;
let topo = 0;

class LogReader {
  constructor(task, logfile, onNewlogDataCallback, onNewTopCallback, direction = APPEND) {
    this.offset = 0;
    this.firstOffset = 0;
    this.lastOffset = 0;
    this.logData = [];
    this.loading = 0;
    this.task = task;
    this.logfile = logfile;
    this.onNewlogDataCallback = onNewlogDataCallback;
    this.onNewTopCallback = onNewTopCallback;
    this.direction = direction;
    this.topo = 0;
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
      this.offset = totalOffset;
      this.offset -= Math.min(totalOffset, 512);
      this.firstOffset = totalOffset;
      this.firstOffset -= Math.min(totalOffset, 512);
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
    MarathonService.request({resource:`tasks/${this.task.id}/files/read?path=${this.logfile}&offset=${this.offset}&length=${BLOCK_SIZE}`})
      .success(this.handleReadOK)
      .error((data) => {
        console.log(`ERROR task ${this.task.id}, ${this.logfile}. ${data}`);
      });
  }

  pollTop() {
    let newLength = BLOCK_SIZE;
    if (this.firstOffset < 0) {
      newLength = newLength + this.firstOffset;
    }
    if (this.firstOffset !== 0) {
      this.firstOffset -= BLOCK_SIZE;
      MarathonService.request({resource:`tasks/${this.task.id}/files/read?path=${this.logfile}&offset=${this.firstOffset < 0 ? this.firstOffset = 0 : this.firstOffset }&length=${newLength}`})
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
      this.offset += data.length;
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
      teste: true,
      control: false,
      loadingBottom : false,
      loadingTop : false,
    };
  },
  componentDidMount() {
    const {task, logfile} = this.props;
    this.reader = new LogReader(task, logfile, this.onNewlogData, this.onNewTop);
    const el = this.refs && this.refs.teste && this.refs.teste.getDOMNode();
    const m = this;
    el.addEventListener("scroll", function () {
      //is top
      if (el.scrollTop === 0) {
        m.setState ({loadingTop : true});
        m.reader.pollTop();
        return ;
      }
      // scroll to top
      if (el.scrollTop + el.clientHeight + 2 < el.scrollHeight) {
        m.reader.stopPoll();
        m.setState({loadingBottom: false, loadingTop: false});
      }
      // check is scroll bottom
      const isBottom = m.checkIsBottom(el);
      if (isBottom) {
        el.scrollTop = el.scrollHeight;
        m.setState ({loadingBottom: true});
        m.reader.restartPool();
      }
      else {
        m.setState ({loadingBottom: false});
      }
    });
  },
  onNewTop(logdata) {
    const el = this.refs && this.refs.teste && this.refs.teste.getDOMNode();
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
    this.setState({
      logdata: logdata,
    }, () => {
      const el = this.refs && this.refs.teste && this.refs.teste.getDOMNode();
      el.scrollTop = el.scrollHeight;
    });
  },
  componentWillUnmount() {
    this.reader.stopPoll();
  },

  checkIsBottom(el) {
    let isBottom = false;
    if (Math.round(el.scrollTop + el.clientHeight)  >= el.scrollHeight ) {
      isBottom = true;
    }
    return isBottom;
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
        <div className="log-view" ref="teste">
          {this.state.loadingTop && loading === 0 ? <i className="icon icon-medium loading"></i> : "" }
          {topo === 1 ? <span>TOPO DO LOG<br></br></span> : ""}
          {this.state.logdata}
        </div>
        {this.state.loadingBottom ? <i className="icon icon-medium loading" style={{marginLeft: "-5px", marginTop: "5px"}}></i> : "" }
      </div>
    );
  }
});