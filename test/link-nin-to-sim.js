const chai = require("chai");
const chaiHttp = require("chai-http");
require("../src/app");

chai.should();

chai.use(chaiHttp);

const serverUrl = "http://localhost:5000";

describe("Link NIN to SIM - APIs", () => {
  describe("POST /api/phone-to-nin", () => {
    it("Link NIN to SIM with valid details", (done) => {
      const data = {
        phoneNumber: "07041211447",
        nin: "93056152233",
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
        phoneNumber: "07041211447",
        nin: "93056152233",
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
        nin: "93056152233",
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
    it("Test: User provided incorrect NIN", (done) => {
      const data = {
        phoneNumber: "07041211447",
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
