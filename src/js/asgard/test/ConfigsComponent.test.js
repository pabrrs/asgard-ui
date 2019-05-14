/* eslint-disable camelcase */
import {expect} from "chai";
import {mount} from "enzyme";
import React from "react";

import ConfigsComponent from "../components/ConfigsComponent";
import PopoverComponent from "../../asgard/components/PopoverComponent";

describe("Configs component", function () {
  before(function () {
    this.component = mount(<ConfigsComponent/>);
  });

  it("has the icon image", function () {
    expect(this.component
			.find("div")
			.first()
			.find("i")
			.hasClass("settings")
    ).to.equal(true);
  });

  describe ("render popover component", function () {

    before(function () {
      this.popoverComponent = mount(<PopoverComponent visible={true}/>);
    });

    it("has header div", function () {
      expect(this.popoverComponent
        .find("div")
        .at(0)
        .hasClass("popover")
      ).to.equal(true);
    });

    it("has content popover", function () {
      expect(this.popoverComponent
        .find("div")
        .at(1)
        .hasClass("content")
      ).to.equal(true);
    });
  });
});