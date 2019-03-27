/* eslint-disable camelcase */
import Util from "../../../helpers/Util";

const UserScheme = {
  user: {
    type: null,
    errors: {},
    id: null,
    name: null,
    email:null,
  },
  current_account: {
    type: null,
    errors: {},
    id: null,
    name: null,
    namespace:null,
    owner:null,
  },
  accounts: [],
};

export default Util.deepFreeze(UserScheme);
