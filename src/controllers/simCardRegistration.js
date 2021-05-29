import db from "../models/index.js";
import { responseObject } from "../helpers/utils.js";
import {
  validateDOB,
  validateGender,
  validatePhoneNumber,
  validateTelco,
} from "../helpers/validators.js";
import { acceptedTelcos, genderDict } from "../helpers/constants.js";

const SimRegistration = db.SimRegistration;

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

    // Check if provided phone number is valid
    if (!validatePhoneNumber(phoneNumber))
      return responseObject(res, 400, "error", null, "Invalid Phone number");

    if (!validateDOB(dob))
      return responseObject(
        res,
        400,
        "error",
        null,
        "Invalid Date of Birth. Use the format 'DD-MM-YYYY'"
      );

    if (!validateTelco(serviceProvider))
      return responseObject(
        res,
        400,
        "error",
        null,
        `Unaccepted Telco Service. Please select one of ${acceptedTelcos}`
      );
    if (!validateGender(gender))
      return responseObject(
        res,
        400,
        "error",
        null,
        `Unaccepted Gender value. Please select one of ${genderDict}`
      );

    // Convert phone number with country code to local phone number to protect database integrity
    let phone = phoneNumber;
    if (phoneNumber.substring(0, 4) === "+234")
      phone = phoneNumber.substring(4).replace(/^/, "0");
    if (phoneNumber.substring(0, 3) === "234")
      phone = phoneNumber.substring(3).replace(/^/, "0");

    const user = await SimRegistration.findOne({
      where: { phoneNumber: phone },
    });
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
      phoneNumber: phone,
    });

    return responseObject(res, 201, "success", newUser);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};

// export const updateSimCardRegistration = async (req, res) => {
//   try {
//     const { phoneNumber } = req.params;
//     const registrationRecord = await SimRegistration.findOne({
//       where: { phoneNumber },
//     });

//     if (!registrationRecord) {
//       return responseObject(
//         res,
//         404,
//         "error",
//         null,
//         "The phone number provided has not been registered"
//       );
//     }

//     const value = req.body;

//     const updatedRecord = await SimRegistration.update(value);

//     return responseObject(res, 200, "success", updatedRecord);
//   } catch (err) {
//     return responseObject(res, 500, "error", null, err.message);
//   }
// };

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
    const user = await SimRegistration.findOne({ where: { phoneNumber } });

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
