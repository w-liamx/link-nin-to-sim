const chai = require("chai");
const chaiHttp = require("chai-http");
const db = require("../src/models");
require("../src/app");

chai.should();

chai.use(chaiHttp);

const serverUrl = "http://localhost:5000";

let citizen = {};
let simCard = {};

describe("Link NIN to SIM - APIs", () => {
  describe("POST /api/phone-to-nin", () => {
    before((done) => {
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
          citizen = res.body.data;
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
    before((done) => {
      const phone =
        "080" +
        Math.floor(Math.random() * 1000000000)
          .toString()
          .substring(0, 8);
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: phone,
        serviceProvider: "MTN",
        gender: "M",
        dob: "10-03-1990",
      };
      chai
        .request(serverUrl)
        .post("/api/sim-registration/create")
        .send(user)
        .end((err, res) => {
          console.log(res.body.data);
          simCard = res.body.data;
          res.should.have.status(201);
          res.body.status.should.be.eq("success");
          res.body.should.have.property("data");
          res.body.data.should.be.a("object");
          done();
        });
    });
    it("Link NIN to SIM with valid details", (done) => {
      const data = {
        phoneNumber: simCard.phoneNumber && simCard.phoneNumber,
        nin: citizen.nin && citizen.nin,
      };
      chai
        .request(serverUrl)
        .post("/api/phone-to-nin")
        .send(data)
        .end((err, res) => {
          res.should.have.status(202);
          res.body.status.should.be.eq("success");
          res.body.should.have.property("message");
          done();
        });
    });
  });

  describe("POST /api/phone-to-nin", () => {
    it("Test an already linked phone number", (done) => {
      const data = {
        phoneNumber: simCard.phoneNumber && simCard.phoneNumber,
        nin: citizen.nin && citizen.nin,
      };
      chai
        .request(serverUrl)
        .post("/api/phone-to-nin")
        .send(data)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.status.should.be.eq("error");
          res.body.should.have
            .property("message")
            .eq(
              "This Phone number has already been Linked to an NIN. Please contact support if you are not aware of this linking."
            );
          done();
        });
    });
  });

  describe("POST /api/phone-to-nin", () => {
    it("Test: User submitted an invalid phone number 1 - input: '02045434333'", (done) => {
      const data = {
        phoneNumber: "02045434333",
        nin: "93056152233",
      };
      chai
        .request(serverUrl)
        .post("/api/phone-to-nin")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq("Invalid Phone number");
          done();
        });
    });
  });

  describe("POST /api/phone-to-nin", () => {
    it("Test: User submitted an invalid phone number 2 - input: '08045434333566444'", (done) => {
      const data = {
        phoneNumber: "08045434333566444",
        nin: "93056152233",
      };
      chai
        .request(serverUrl)
        .post("/api/phone-to-nin")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq("Invalid Phone number");
          done();
        });
    });
  });

  describe("POST /api/phone-to-nin", () => {
    it("Test: User submitted an invalid phone number 3 - input: '+23445434333566444'", (done) => {
      const data = {
        phoneNumber: "+23445434333566444",
        nin: "93056152233",
      };
      chai
        .request(serverUrl)
        .post("/api/phone-to-nin")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq("Invalid Phone number");
          done();
        });
    });
  });

  describe("POST /api/phone-to-nin", () => {
    it("Test: User submitted an invalid phone number 3 - input: '0905762456p'", (done) => {
      const data = {
        phoneNumber: "0905762456p",
        nin: "93056152233",
      };
      chai
        .request(serverUrl)
        .post("/api/phone-to-nin")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq("Invalid Phone number");
          done();
        });
    });
  });

  describe("POST /api/phone-to-nin", () => {
    it("Test: User submitted invalid NIN 1 - Input: '315752241258873'", (done) => {
      const data = {
        phoneNumber: "07041211447",
        nin: "315752241258873",
      };
      chai
        .request(serverUrl)
        .post("/api/phone-to-nin")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq("Invalid NIN");
          done();
        });
    });
  });

  describe("POST /api/phone-to-nin", () => {
    it("Test: User submitted invalid NIN 2 - Input: 'utyugduti'", (done) => {
      const data = {
        phoneNumber: "07041211447",
        nin: "utyugduti",
      };
      chai
        .request(serverUrl)
        .post("/api/phone-to-nin")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq(`Invalid NIN`);
          done();
        });
    });
  });

  describe("POST /api/phone-to-nin", () => {
    it("Test: User provided un-registered phone number", (done) => {
      const data = {
        phoneNumber: "07041311443",
        nin: citizen.nin && citizen.nin,
      };
      chai
        .request(serverUrl)
        .post("/api/phone-to-nin")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have
            .property("message")
            .eq(
              "You have provided an Invalid Phone number. Make sure your phone number is correct and is Registered"
            );
          done();
        });
    });
  });

  describe("POST /api/phone-to-nin", () => {
    let sim2;
    before((done) => {
      const phone =
        "080" +
        Math.floor(Math.random() * 1000000000)
          .toString()
          .substring(0, 8);
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: phone,
        serviceProvider: "MTN",
        gender: "M",
        dob: "10-03-1990",
      };
      chai
        .request(serverUrl)
        .post("/api/sim-registration/create")
        .send(user)
        .end((err, res) => {
          sim2 = res.body.data;
          res.should.have.status(201);
          res.body.status.should.be.eq("success");
          res.body.should.have.property("data");
          res.body.data.should.be.a("object");
          done();
        });
    });
    it("Test: User provided incorrect NIN", (done) => {
      const data = {
        phoneNumber: sim2.phoneNumber && sim2.phoneNumber,
        nin: "66677788899",
      };
      chai
        .request(serverUrl)
        .post("/api/phone-to-nin")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have
            .property("message")
            .eq(
              "You have provided an Invalid NIN. This may be due to a typographical error or that you have not registered for NIN. Please confirm that your NIN is correct by searching in the NIN database."
            );
          done();
        });
    });
  });

  describe("GET /api/reports", () => {
    it("Test GET all reports for all linking requests", (done) => {
      chai
        .request(serverUrl)
        .get("/api/reports")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.status.should.be.eq("success");
          res.body.data.should.be.a("object");
          res.body.data.should.have.property("reports");
          res.body.data.should.have.property("statistics");
          done();
        });
    });
  });
});
