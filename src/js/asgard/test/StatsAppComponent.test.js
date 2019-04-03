/* eslint-disable camelcase */
import {expect} from "chai";
import {shallow} from "enzyme";
import nock from "nock";
import config from "../../config/config";
import React from "react/addons";
import Util from "../../helpers/Util";
import appScheme from "../../stores/schemes/appScheme";
import AppsActions from "../../actions/AppsActions";
import AppsEvents from "../../events/AppsEvents";
import AppsStore from "../../stores/AppsStore";
import AppPageComponent from "../../components/AppPageComponent";
import StatsAppComponent from "../components/StatsAppComponent";
import StatsAppStore from "../stores/StatsAppStore";
import StatsAppActions from "../actions/StatsAppActions";
import StatsAppEvents from "../events/StatsAppEvents";

let nameId;

describe("AppPageComponent", function () {
  before(function (done) {
    var app = Util.extendObject(appScheme, {
      id: "/test-app-1",
    });
    teste = app.id;
    nock(config.apiURL)
      .get("/v2/apps//test-app-1")
      .query(true)
      .reply(200, {
        app: app
      });

    var context = {
      router: {
        getCurrentParams: function () {
          return {
            appId: "/test-app-1"
          };
        }
      }
    };

    AppsStore.once(AppsEvents.CHANGE, () => {
      this.component = shallow(<AppPageComponent />, {context});
      done();
    });

    AppsActions.requestApp("/test-app-1");
  });

});

var server = config.localTestserverURI;
config.apiURL = "http://" + server.address + ":" + server.port + "/";

describe("request applications and groups", function () {

  before(function (done) {
    var nockResponse = {
      stats: {
        type: "ASGARD",
        errors: {},
        cpu_pct: "0",
        ram_pct: "0",
      },
    };

    nock(config.apiURL)
      .get("/apps/captura/stats")
      .query(true)
      .reply(200, nockResponse);

    StatsAppStore.once(StatsAppEvents.CHANGE, done);
    StatsAppActions.requestStats("/captura");
  });

  it("if stats have type", function () {
    expect(StatsAppStore.stats.type).to.equal("ASGARD");
  });

  it("if stats have type", function () {
    expect(StatsAppStore.stats.ram_pct).to.equal("0");
  });

  it("if stats have cpu pct", function () {
    expect(StatsAppStore.stats.cpu_pct).to.equal("0");
  });

  before(function () {
    this.component = shallow(<StatsAppComponent app={nameId}/>);
  });

  it("has the text in div", function () {
    expect(this.component
			.find("div")
      .at(0)
      .text()
    ).to.equal("Resource UsageRefresh");
  });
});
