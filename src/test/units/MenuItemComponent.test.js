import {expect} from "chai";
import {mount} from "enzyme";

import React from "react";

import MenuItemComponent from "../../js/components/MenuItemComponent";

describe("MenuItemComponent", function () {
  var mountComponent;

  before(function () {
    var component = (
      <MenuItemComponent value="general" selected={true}>
        General
      </MenuItemComponent>
    );
    mountComponent = mount(component);
  });

  it("should be checked", function () {
    expect(mountComponent.find("input").props().checked).to.be.true;
  });

  it("should have the correct value", function () {
    expect(mountComponent.find("input").props().value)
      .to.equal("general");
  });
});
