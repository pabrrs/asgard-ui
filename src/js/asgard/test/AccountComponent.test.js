/* eslint-disable camelcase */
import {expect} from "chai";
import {shallow} from "enzyme";
import React from "react/addons";

import AccountComponent from "../components/AccountComponent";

describe("Configs component", function () {
  before(function () {
    this.component = shallow(<AccountComponent/>);
  });

  it("has the PopoverComponent test", function () {
    expect(this.component
      .find("div")
      .at(3)
      .text()
    ).to.equal("");
  });

});