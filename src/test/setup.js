import "babel-polyfill";
import jsdom from "jsdom";
import "jsdom-global/register";
import {configure} from "enzyme";
import Adapter from "enzyme-adapter-react-15";
configure({adapter: new Adapter()});

const {JSDOM} = jsdom;

const {document} = (new JSDOM("")).window;

global.document = document;
global.window = document.defaultView;
global.navigator = {
  userAgent: "node.js",
  platform: {
    match: () => {},
  },
  appName: {
    indexOf: () => {}
  }
};