const chai = require("chai");
const chaiHttp = require("chai-http");
require("../src/app");

const { acceptedTelcos, genderDict } = require("../src/helpers/constants.js");

chai.should();

chai.use(chaiHttp);

const serverUrl = "http://localhost:5000";

describe("Sim Registration APIs", () => {
  describe("POST /api/sim-registration/create", () => {
    it("Register a new sim card with valid details", (done) => {
      const phone = "080" + Math.floor(Math.random() * 1000000000).toString().substring(0, 8)
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
          res.should.have.status(201);
          res.body.status.should.be.eq("success");
          res.body.should.have.property("data");
          res.body.data.should.be.a("object");
          done();
        });
    });
  });

  describe("POST /api/sim-registration/create", () => {
    it("Test an already registered phone number", (done) => {
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: "07041211447",
        serviceProvider: "MTN",
        gender: "M",
        dob: "10-03-1990",
      };
      chai
        .request(serverUrl)
        .post("/api/sim-registration/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have
            .property("message")
            .eq(
              "This phone number is already registered. Go ahead and link your phone number to your NIN if you have not done so."
            );
          done();
        });
    });
  });

  describe("POST /api/sim-registration/create", () => {
    it("Test sim card registration with an invalid phone number 1 - input: '02045434333'", (done) => {
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: "02045434333",
        serviceProvider: "MTN",
        gender: "M",
        dob: "10-03-1990",
      };
      chai
        .request(serverUrl)
        .post("/api/sim-registration/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq("Invalid Phone number");
          done();
        });
    });
  });

  describe("POST /api/sim-registration/create", () => {
    it("Test sim card registration with an invalid phone number 2 - input: '08045434333566444'", (done) => {
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: "08045434333566444",
        serviceProvider: "MTN",
        gender: "M",
        dob: "10-03-1990",
      };
      chai
        .request(serverUrl)
        .post("/api/sim-registration/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq("Invalid Phone number");
          done();
        });
    });
  });

  describe("POST /api/sim-registration/create", () => {
    it("Test sim card registration with an invalid phone number 3 - input: '+23445434333566444'", (done) => {
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: "+23445434333566444",
        serviceProvider: "MTN",
        gender: "M",
        dob: "10-03-1990",
      };
      chai
        .request(serverUrl)
        .post("/api/sim-registration/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq("Invalid Phone number");
          done();
        });
    });
  });

  describe("POST /api/sim-registration/create", () => {
    it("Test sim card registration with an invalid phone number 4 - input: '0905762456p'", (done) => {
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: "0905762456p",
        serviceProvider: "MTN",
        gender: "M",
        dob: "10-03-1990",
      };
      chai
        .request(serverUrl)
        .post("/api/sim-registration/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have.property("message").eq("Invalid Phone number");
          done();
        });
    });
  });

  describe("POST /api/sim-registration/create", () => {
    it("Test sim card registration with an invalid service provider - Input: 'GOTV'", (done) => {
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: "09057624569",
        serviceProvider: "GOTV",
        gender: "M",
        dob: "10-03-1990",
      };
      chai
        .request(serverUrl)
        .post("/api/sim-registration/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have
            .property("message")
            .eq(
              `Unaccepted Telco Service. Please select one of ${acceptedTelcos}`
            );
          done();
        });
    });
  });

  describe("POST /api/sim-registration/create", () => {
    it("Test sim card registration with an unaccepted Date format or Date value for Date of birth - Input: '1977-04-09'", (done) => {
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: "09057624569",
        serviceProvider: "GLO",
        gender: "M",
        dob: "1977-04-09",
      };
      chai
        .request(serverUrl)
        .post("/api/sim-registration/create")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eq("error");
          res.body.should.have
            .property("message")
            .eq(`Invalid Date of Birth. Use the format 'DD-MM-YYYY'`);
          done();
        });
    });
  });

  describe("POST /api/sim-registration/create", () => {
    it("Test sim card registration with an unaccepted gender value - Input: 'Man'", (done) => {
      const user = {
        firstName: "Williams",
        middleName: "",
        lastName: "Afiuwka",
        phoneNumber: "09057624569",
        serviceProvider: "GLO",
        gender: "Man",
        dob: "10-03-1990",
      };
      chai
        .request(serverUrl)
        .post("/api/sim-registration/create")
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

  describe("GET /api/sim-users", () => {
    it("Test GET all registered Sim Cards", (done) => {
      chai
        .request(serverUrl)
        .get("/api/sim-users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.status.should.be.eq("success");
          res.body.data.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /api/sim-users/:phoneNumber", () => {
    it("Test GET one registered sim card by phone number", (done) => {
      chai
        .request(serverUrl)
        .get("/api/sim-users/07041211447")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.status.should.be.eq("success");
          res.body.data.should.be.a("object");
          done();
        });
    });
  });

  describe("GET /api/sim-users/:phoneNumber", () => {
    it("Test GET un-registered phone number", (done) => {
      chai
        .request(serverUrl)
        .get("/api/sim-users/08067586544")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.status.should.be.eq("error");
          res.body.should.have
            .property("message")
            .eq("The phone number provided has not been registered");
          done();
        });
    });
  });
});
