/* eslint-disable camelcase */
import {expect} from "chai";
import {shallow} from "enzyme";
import React from "react/addons";
import AgentsComponent from "../components/AgentsComponent";

describe("Agents component", function () {
  var model = {
    hostname: "123",
    id: "1" ,
    version: "1.4.1",
    total_apps: 2,
    application: [],
    port: 123,
    used_resources: {cpus: "1", mem : "1"},
    resources: {cpus: "1", mem : "1"},
    stats : {ram_pct: "50.00", cpu_pct: "40.00"},
    attributes: {"workload" : "general"},
    active: "null",
    type: "MESOS",
  };
  var total = 1;

  before(function () {
    this.component = shallow(<AgentsComponent total={total} model={model} />);
  });

  it("has the correct totalApp", function () {
    expect(this.component
      .find("tr")
      .first()
      .find("span")
      .at(0)
      .text()
    ).to.equal('1');
  });

});
