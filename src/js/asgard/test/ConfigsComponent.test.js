/* eslint-disable camelcase */
import {expect} from "chai";
import {shallow} from "enzyme";
import React from "react/addons";

import ConfigsComponent from "../components/ConfigsComponent";

describe("Configs component", function () {
  before(function () {
    this.component = shallow(<ConfigsComponent/>);
  });

  it("has the icon image", function () {
    expect(this.component
			.find("div")
			.first()
			.find("i")
			.hasClass("settings")
    ).to.equal(true);
  });

  it("has the PopoverComponent", function () {
    expect(this.component
      .find("div")
      .at(0)
      .text()
    ).to.equal("<Constructor />");
  });

});