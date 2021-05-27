import db from "../models/index.js";
import { responseObject } from "../helpers/utils.js";

const SimRegistration = db.SimRegistration;

// "This Citizen already exists in the database. Please ensure that the NIN you have provided belongs to you, or report to the authorities if you think you are being impersonated."

export const registerSim = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      serviceProvider,
      phoneNumber,
    } = req.body;

    // If user has NIN ready, do the linking here.
    const trackingId = ""; // generate trackingID, nin = generate NIN
    const user = await SimRegistration.findOne({ where: { phoneNumber } });
    if (user) {
      return responseObject(
        res,
        400,
        "error",
        null,
        "This phone number is already registered. Go ahead and link your phone number to your NIN if you have not done so."
      );
    }

    const newUser = await SimRegistration.create({
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      serviceProvider,
      phoneNumber,
    });

    return responseObject(res, 201, "success", newUser);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};

export const updateSimCardRegistration = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const registrationRecord = await SimRegistration.findOne({
      where: { phoneNumber },
    });

    if (!registrationRecord) {
      return responseObject(
        res,
        404,
        "error",
        null,
        "The phone number provided has not been registered"
      );
    }

    const value = req.body;

    const updatedRecord = await SimRegistration.update(value);

    return responseObject(res, 200, "success", updatedRecord);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const allUsers = await SimRegistration.findAll();

    return responseObject(res, 200, "success", allUsers);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await CitizensNin.findOne({ where: { phoneNumber } });

    if (!user) {
      return responseObject(
        res,
        404,
        "error",
        null,
        "The phone number provided has not been registered"
      );
    }

    return responseObject(res, 200, "success", user);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};
