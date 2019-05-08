/* eslint-disable camelcase */
import {expect} from "chai";
import {shallow} from "enzyme";
import React from "react/addons";
import PopoverComponent from "../components/PopoverComponent";

describe("Popover component", function () {
  before(function () {
    this.component = shallow(
      <PopoverComponent visible={true}
        className="dropdown"
      />
    );
  });

  it("render component", function () {
    expect(this.component
      .text()
    ).to.equal("");
  });

});
