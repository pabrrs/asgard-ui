/* eslint-disable camelcase */
import {expect} from "chai";
import {shallow} from "enzyme";
import React from "react";

import AgentsComponent from "../components/AgentsComponent";
import AppListItemLabelsComponent from
"../../components/AppListItemLabelsComponent";

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
  var total = 2;

  before(function () {
    this.component = shallow(<AgentsComponent total={total} model={model} />);
  });

  it("has the correct agents hostname", function () {
    expect(this.component
      .find("td")
      .first()
      .find("span")
      .at(1)
      .text()
    ).to.equal("123");
  });

  it("has the correct totalApp", function () {
    expect(
      this.component
        .find("tr")
        .first()
        .find("span")
        .at(0)
        .text()
    ).to.equal('2');
  });
  
  it("has the correct totalapps", function () {
    expect(this.component
      .find("td")
      .at(1)
      .text()
    ).to.equal("2");
  });

  it("has the correct total CPU", function () {
    expect(this.component
      .find("td")
      .at(2)
      .text()
    ).to.equal("1/1 - (40.00 % )");
  });

  it("has the correct total RAM", function () {
    expect(this.component
      .find("td")
      .at(3)
      .text()
    ).to.equal("1/1 - (50.00 % )");
  });

  it("has the correct TYPE", function () {
    expect(this.component
      .find("td")
      .at(4)
      .text()
    ).to.equal("MESOS");
  });

  it("has the correct Agent Version", function () {
    expect(this.component
      .find("td")
      .at(5)
      .text()
    ).to.equal("1.4.1");
  });

  describe("Tags", function () {
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

    before(function () {
      this.secondComponent = shallow (<AppListItemLabelsComponent
        numberOfVisibleLabels={3} labels={model.attributes} ref="labels"/>);
    });

    it ("has the correct tags",function () {
      expect(this.secondComponent
        .find(".visible")
        .at(0)
        .text()
      ).to.equal("workload:general");
    });


  });
});
