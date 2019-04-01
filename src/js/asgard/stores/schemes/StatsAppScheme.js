/* eslint-disable camelcase */
import Util from "../../../helpers/Util";

const StatsAppScheme = {
  type: null,
  errors: {},
  cpu_pct: null,
  ram_pct: null
};

export default Util.deepFreeze(StatsAppScheme);
