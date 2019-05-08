/* eslint-disable camelcase */
import {expect} from "chai";
import {shallow} from "enzyme";
import React from "react/addons";
import PopoverComponent from "../components/PopoverComponent";

describe("Popover component", function () {

  const test = "Test";

  before(function () {
    this.component = shallow(
      <PopoverComponent visible={true}
        className="dropdown">
        <li>
          <a>
            {test}
          </a>
        </li>
      </PopoverComponent>
    );
  });

  it("render component", function () {
    expect(this.component
      .text()
    ).to.equal("Test");
  });

});
