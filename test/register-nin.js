const chai = require("chai");
const chaiHttp = require("chai-http");
require("../src/app");

const { acceptedTelcos, genderDict } = require("../src/helpers/constants.js");

chai.should();

chai.use(chaiHttp);

const serverUrl = "http://localhost:5000";

describe("NIN Registration APIs", () => {
  describe("POST /api/nin-registration/create", () => {
    it("Register for NIN with valid details", (done) => {
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        gender: "M",
      };
      chai
        .request(serverUrl)
        .post("/api/nin-registration/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.status.should.be.eq("success");
          res.body.should.have.property("data");
          res.body.data.should.be.a("object");
          res.body.data.should.have.property("trackingId");
          res.body.data.should.have.property("nin");
          res.body.data.should.have.property("wallet");
          done();
        });
    });
  });

  describe("POST /api/nin-registration/create", () => {
    it("Test NIN registration with an unaccepted gender value - Input: 'Man'", (done) => {
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: "09057624569",
        serviceProvider: "GLO",
        gender: "Man",
        dob: "1977-04-09",
      };
      chai
        .request(serverUrl)
        .post("/api/nin-registration/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have
            .property("message")
            .eq(`Unaccepted Gender value. Please select one of ${genderDict}`);
          done();
        });
    });
  });

  describe("GET /api/citizens", () => {
    it("Test GET all verified citizens who have registered for NIN", (done) => {
      chai
        .request(serverUrl)
        .get("/api/citizens")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.status.should.be.eq("success");
          res.body.data.should.be.a("array");
          done();
        });
    });
  });

  //   describe("GET /api/citizens/:nin", () => {
  //     it("Test GET ONE verified citizen by NIN", (done) => {
  //       chai
  //         .request(serverUrl)
  //         .get("/api/citizens/1")
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.status.should.be.eq("success");
  //           res.body.data.should.be.a("object");
  //           done();
  //         });
  //     });
  //   });

  describe("GET /api/citizens/:nin", () => {
    it("Test GET unknown citizen", (done) => {
      chai
        .request(serverUrl)
        .get("/api/citizens/12345678910")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq("Citizen not found");
          done();
        });
    });
  });
});
