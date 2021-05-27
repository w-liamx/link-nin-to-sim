import express from "express";
import {
  createCitizen,
  getAllCitizens,
  getSingleCitizen,
  updateCitizenRecord,
} from "../controllers/citizensNinRegistration.js";
import {
  getRequestReports,
  linkPhoneToNin,
} from "../controllers/linkSimCardToNin.js";
import {
  getAllUsers,
  getSingleUser,
  registerSim,
  updateSimCardRegistration,
} from "../controllers/simCardRegistration.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *      schemas:
 *          SimCardRegistration:
 *              type: object
 *              required:
 *                  - firstName
 *                  - lastName
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: Auto-generated identifier for this Sim Card User
 *                  firstName:
 *                      type: integer
 *                      description: Sim Card User's First Name
 *                  middleName:
 *                      type: integer
 *                      description: Sim Card User's Middle Name
 *                  lastName:
 *                      type: integer
 *                      description: Sim Card User's Last Name
 *                  example:
 *                      id: 1
 *                      firstName: Williams
 *                      middleName: Bill
 *                      lastName: Afiukwa
 */

/**
 * @swagger
 */
router.post("/sim-registration/create", registerSim);
router.put("/sim-registration/:id/update", updateSimCardRegistration);
router.get("/sim-users/:id", getSingleUser);
router.get("/sim-users", getAllUsers);

router.post("/nin-registration/create", createCitizen);
router.put("/nin-registration/:id/update", updateCitizenRecord);
router.get("/citizens/:id", getSingleCitizen);
router.get("/citizens/", getAllCitizens);

router.post("/phone-to-nin", linkPhoneToNin);
router.get("/reports", getRequestReports);

export default router;
