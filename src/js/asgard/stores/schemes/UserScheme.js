import Util from "../../../helpers/Util";

const UserScheme = {
  name: null,
  email: null,
  application: [],
  accounts: [],
};

export default Util.deepFreeze(UserScheme);
