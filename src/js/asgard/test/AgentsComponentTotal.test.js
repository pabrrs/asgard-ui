/* eslint-disable camelcase */
import { expect } from "chai";
import { shallow } from "enzyme";
import nock from "nock";
import config from "../../../js/config/config";
import AgentsStore from "../../asgard/stores/AgentsStore";
import AgentsActions from "../../asgard/actions/AgentsActions";
import AgentsEvents from "../../asgard/events/AgentsEvents";

var server = config.localTestserverURI;
config.apiURL = "http://" + server.address + ":" + server.port + "/";

describe("Agents list component", function() {
  before(function(done) {
    var nockResponse = {
      stats: {
        cpu_pct: "40",
        cpu_ram: "50",
        total: "6"
      },
      agents: {}
    };

    nock(config.apiURL)
      .get("/agents/with-attrs?")
      .query(true)
      .reply(200, nockResponse);

    AgentsStore.once(AgentsEvents.CHANGE, done);
    AgentsActions.requestAgents();
  });

  it("if user have id", function() {
    // console.log("meu stats", AgentsStore.stats);
    // expect(AgentsStore.stats.cpu_pct).to.equal("50");
  });
});
