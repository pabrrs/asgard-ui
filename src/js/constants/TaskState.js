const TaskState = {
  GONE: "TASK_GONE",
  LOST: "TASK_LOST",
  ERROR: "TASK_ERROR",
  FAILED: "TASK_FAILED",
  KILLED: "TASK_KILLED",
  DROPPED: "TASK_DROPPED",
  KILLING: "TASK_KILLING",
  RUNNING: "TASK_RUNNING",
  STAGING: "TASK_STAGING",
  UNKNOWN: "TASK_UNKNOWN",
  FINISHED: "TASK_FINISHED",
  UNREACHABLE: "TASK_UNREACHABLE",
  GONE_BY_OPERATOR: "TASK_GONE_BY_OPERATOR",

  get TERMINAL_STATES() {
    return [this.GONE, this.ERROR, this.FAILED, this.KILLED, this.DROPPED];
  },

  get OK_STATES() {
    return [this.RUNNING, this.FINISHED];
  },

  get STAGED_STATES() {
    return [this.LOST, this.KILLING, this.STAGING];
  },

  get UNKNOWN_STATES() {
    return [this.UNKNOWN, this.UNREACHABLE, this.GONE_BY_OPERATOR];
  }
};

export default Object.freeze(TaskState);
