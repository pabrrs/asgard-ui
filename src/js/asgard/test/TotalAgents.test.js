/* eslint-disable camelcase */
import {expect} from "chai";
import {shallow} from "enzyme";
import nock from "nock";
import config from "../../../js/config/config";
import AgentsStore from "../../asgard/stores/AgentsStore";
import AgentsActions from "../../asgard/actions/AgentsActions";
import AgentsEvents from "../../asgard/events/AgentsEvents";

var server = config.localTestserverURI;
config.apiURL = "http://" + server.address + ":" + server.port + "/";

describe("request total apps", function () {
  before(function (done) {
    var nockResponse = {
      agents: {
        length: 10,
      },
    };

    nock(config.apiURL)
      .get("/agents/with-attrs?")
      .query(true)
      .reply(200, nockResponse);

    AgentsStore.once(AgentsEvents.CHANGE, done);
    AgentsActions.requestAgents();
  });

  it("if have total apps", function() {
    expect(AgentsStore.length).to.equal(10);
  });
});