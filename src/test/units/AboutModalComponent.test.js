import {expect} from "chai";
import {shallow} from "enzyme";
import nock from "nock";
import _ from "underscore";

import React from "react/addons";
import AboutModalComponent
  from "../../js/components/modals/AboutModalComponent";
import InfoActions from "../../js/actions/InfoActions";
import InfoEvents from "../../js/events/InfoEvents";
import InfoStore from "../../js/stores/InfoStore";
import ObjectDlComponent from "../../js/components/ObjectDlComponent";
import AppDispatcher from "../../js/AppDispatcher";

import config from "../../js/config/config";

describe("About Modal", function () {
  var info;
  var component;
  before(function (done) {
    info = {
      "version": "1.2.3",
      "frameworkId": "framework1",
      "leader": "leader1.dcos.io",
      "marathon_config": {
        "marathon_field_1": "mf1",
        "marathon_field_2": "mf2"
      },
      "zookeeper_config": {
        "zookeeper_field_1": "zk1",
        "zookeeper_field_2": "zk2"
      }
    };

    nock(config.apiURL)
      .get("/v2/info")
      .reply(200, info);
    
    InfoStore.once(InfoEvents.CHANGE, () => {
      component = shallow(<AboutModalComponent destroy={_.noop} />);
      done();
    });

    AppDispatcher.dispatch({
      actionType: InfoEvents.REQUEST,
      data: {body: info},
    });
  });

  after(function () {
    component.instance().componentWillUnmount();
  });

  it("displays the current Marathon version", function () {
    expect(component.find(".modal-title").text()).to.equal("Version 1.2.3");
  });

  it("displays the current framework id", function () {
    expect(component.find(".modal-body").text()).to.contain("framework1");
  });

  it("displays the current leader", function () {
    expect(component.find(".modal-body").text()).to.contain("leader1.dcos.io");
  });

  it("displays the fields in the marathon config", function () {
    var objectDlComponent = component.find(ObjectDlComponent).first();
    var props = objectDlComponent.first().props().object;
    expect(props).to.deep.equal({
      "marathon_field_1": "mf1",
      "marathon_field_2": "mf2"
    });
  });

  it("displays the fields in the zookeeper config", function () {
    var objectDlComponent = component.find(ObjectDlComponent).at(1);
    var props = objectDlComponent.first().props().object;
    expect(props).to.deep.equal({
      "zookeeper_field_1": "zk1",
      "zookeeper_field_2": "zk2"
    });
  });

});
