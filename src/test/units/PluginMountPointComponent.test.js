import {expect} from "chai";
import {mount} from "enzyme";
import React from "react";

import PluginComponentStore from "../../js/stores/PluginComponentStore";
import PluginComponentEvents from "../../js/events/PluginComponentEvents";
import PluginDispatcher from "../../js/plugin/shared/PluginDispatcher";
import PluginEvents from "../../js/plugin/shared/PluginEvents";
import PluginMoundPointComponent
  from "../../js/components/PluginMountPointComponent";

describe("PluginMountPointComponent", function () {

  before(function () {
    this.pluginMountPointComponentA =
      mount(<PluginMoundPointComponent placeId="testMountPointPlaceId" />);

    this.pluginMountPointComponentB =
      mount(<PluginMoundPointComponent placeId="testMountPointPlaceId" />);

    this.pluginMountPointComponentC =
      mount(<PluginMoundPointComponent placeId="differentPlaceId" />);

    const data = {
      eventType: PluginEvents.INJECT_COMPONENT,
      placeId: "testMountPointPlaceId",
      component: <span>Test Mount Point Component</span>
    };
    this.pluginMountPointComponentA.instance().handleComponentStoreChange(data);
    this.pluginMountPointComponentB.instance().handleComponentStoreChange(data);
    this.pluginMountPointComponentC.instance().handleComponentStoreChange(data);

    this.pluginMountPointComponentA.update();
    this.pluginMountPointComponentB.update();
    this.pluginMountPointComponentC.update();
  });

  it("renders component with given place id", function () {
    expect(this.pluginMountPointComponentA.find("span").text())
      .to.equal("Test Mount Point Component");

    expect(this.pluginMountPointComponentB.find("span").text())
      .to.equal("Test Mount Point Component");
  });

  it("does not render at non-matching place id", function () {
    expect(this.pluginMountPointComponentC.find("span").length)
      .to.equal(0);
  });

});
