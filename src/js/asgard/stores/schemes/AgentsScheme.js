import Util from "../../../helpers/Util";

const agentsScheme = {
  application: [],
  hostname: null,
  id: null,
  tags: null,
  version: null,
  port: null,
  usedResources: [],
  attributes: [],
  active: null,
  type: null,
  totalApps: null,
};

export default Util.deepFreeze(agentsScheme);
