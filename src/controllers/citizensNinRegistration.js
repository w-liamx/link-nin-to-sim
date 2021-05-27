import db from "../models/index.js";
import { random, responseObject } from "../helpers/utils.js";

const Citizen = db.CitizensNin;
// const Wallet = db.Wallet;
const SystemSettings = db.SystemSettings;

// "This Citizen already exists in the database. Please ensure that the NIN you have provided belongs to you, or report to the authorities if you think you are being impersonated."

export const createCitizen = async (req, res) => {
  try {
    const { firstName, middleName, lastName, gender } = req.body;

    // Generate a 12 chars string that will make the tracking Id for this user
    const trackingId = random(12);

    // Generate 11 digits number that will make the user's NIN
    let nin = Math.random() * 100000000000 + 1;

    /** Assuming we have control over citizen's NIN registration portal,
     * We can create a wallet in our system for every new citizen
     * that registers for NIN. This wallet is where we charge them for
     * for using our service. (Linking phone number to NIN)
     */

    // Get users initial/starting balance from System Settings (in the database)
    const balanceSetting = await SystemSettings.findOne({
      where: { key: "usersStartingBalance" },
    });
    const initialBalance = balanceSetting.value;

    const newCitizen = await Citizen.create(
      {
        firstName,
        middleName,
        lastName,
        gender,
        trackingId,
        nin,
        Wallet: {
          balance: initialBalance,
        },
      },
      {
        include: [Wallet],
      }
    );

    // await Wallet.create({
    //   nin: newCitizen.nin,
    //   balance: initialBalance,
    // });

    // const user = Citizen.findOne({
    //   where: { nin: newCitizen.nin },
    //   include: [
    //     {
    //       model: Wallet,
    //       as: "wallet",
    //       attributes: ["balance"],
    //     },
    //   ],
    // });

    return responseObject(res, 201, "success", newCitizen);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};

export const updateCitizenRecord = async (req, res) => {
  try {
    const { nin } = req.params;
    const citizen = await Citizen.findOne({ where: { nin } });

    if (!citizen) {
      return responseObject(res, 404, "error", null, "Citizen not found");
    }

    const value = req.body;

    const updatedCitizen = await Citizen.update(value);

    return responseObject(res, 200, "success", updatedCitizen);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};

export const getAllCitizens = async (_req, res) => {
  try {
    const allCitizens = await Citizen.findAll();

    return responseObject(res, 200, "success", allCitizens);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};

export const getSingleCitizen = async (req, res) => {
  try {
    const { nin } = req.params;
    const citizen = await Citizen.findOne({ where: { nin } });

    if (!citizen) {
      return responseObject(res, 404, "error", null, "Citizen not found");
    }

    return responseObject(res, 200, "success", citizen);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};
