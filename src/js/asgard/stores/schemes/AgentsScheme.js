import Util from "../../../helpers/Util";

const agentsScheme = {
  hostname: null,
  id: null,
  tags: null,
  version: null,
  port: null,
  usedResources: [],
  attributes: [],
  active: null,
  type: null,
};

export default Util.deepFreeze(agentsScheme);
