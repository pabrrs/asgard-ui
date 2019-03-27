/* eslint-disable camelcase */
import {expect} from "chai";
import nock from "nock";
import config from "../../../js/config/config";
import UserStore from "../../asgard/stores/UsersStore";
import UserActions from "../../asgard/actions/UserActions";
import UserEvents from "../../asgard/events/UserEvents";

var server = config.localTestserverURI;
config.apiURL = "http://" + server.address + ":" + server.port + "/";

describe("request applications and groups", function () {

  before(function (done) {
    var nockResponse = {
      user: {
        type: "ASGARD",
        errors: {},
        id: 6,
        name: "Test",
        email:"test@test.com",
      },
      current_account: {
        type: "ASGARD",
        errors: {},
        id: 2,
        name: "Test",
        namespace:"teste",
        owner:"ads",
      },
      accounts: [
        {
          type: "ASGARD",
          errors: {},
          id: 3,
          name: "Asgard/HMG",
          namespace: "asgard",
          owner: "asgard"
        }
      ],
    };

    nock(config.apiURL)
      .get("/users/me")
      .query(true)
      .reply(200, nockResponse);

    UserStore.once(UserEvents.CHANGE, done);
    UserActions.requestUser();
  });

  it("if user have id", function () {
    expect(UserStore.users.user.id).to.equal(6);
  });
  it("if user have type", function () {
    expect(UserStore.users.user.type).to.equal("ASGARD");
  });
  it("if user have name", function () {
    expect(UserStore.users.user.name).to.equal("Test");
  });
  it("if user have email", function () {
    expect(UserStore.users.user.email).to.equal("test@test.com");
  });
  it("if current account have id", function () {
    expect(UserStore.users.current_account.id).to.equal(2);
  });
  it("if current_account have type", function () {
    expect(UserStore.users.current_account.type).to.equal("ASGARD");
  });
  it("if current_account have name", function () {
    expect(UserStore.users.current_account.name).to.equal("Test");
  });
  it("if current_account have namespace", function () {
    expect(UserStore.users.current_account.namespace).to.equal("teste");
  });
  it("if current_account have owner", function () {
    expect(UserStore.users.current_account.owner).to.equal("ads");
  });
  it("if accounts have id", function () {
    expect(UserStore.users.accounts[0].id).to.equal(3);
  });
  it("if accounts have type", function () {
    expect(UserStore.users.accounts[0].type).to.equal("ASGARD");
  });
  it("if accounts have name", function () {
    expect(UserStore.users.accounts[0].name).to.equal("Asgard/HMG");
  });
  it("if accounts have namespace", function () {
    expect(UserStore.users.accounts[0].namespace).to.equal("asgard");
  });
  it("if accounts have owner", function () {
    expect(UserStore.users.accounts[0].owner).to.equal("asgard");
  });
});
