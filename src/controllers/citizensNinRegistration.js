import db from "../models/index.js";
import { random, responseObject } from "../helpers/utils.js";
import { validateGender } from "../helpers/validators.js";
import { genderDict } from "../helpers/constants.js";

const Citizen = db.CitizensNin;
const Wallet = db.Wallet;
const SystemSettings = db.SystemSetting;

export const createCitizen = async (req, res) => {
  try {
    const { firstName, middleName, lastName, gender } = req.body;

    if (!validateGender(gender))
      return responseObject(
        res,
        400,
        "error",
        null,
        `Unaccepted Gender value. Please select one of ${genderDict}`
      );

    // Generate a 12 chars string that will make the tracking Id for this user
    const trackingId = random(12);

    // Generate 11 digits number that will make the user's NIN
    let nanId = Math.random() * 100000000000 + 1;
    let nin = Math.floor(nanId).toString();

    /** Assuming we have control over citizen's NIN registration portal,
     * We can create a wallet in our system for every new citizen
     * that registers for NIN. This wallet is where we charge them for
     * for using our service. (Linking phone number to NIN)
     */

    await Citizen.create({
      firstName,
      middleName,
      lastName,
      gender,
      trackingId,
      nin,
    }).then(async (citizen) => {
      // Get users initial/starting balance from System Settings (in the database)
      const balanceSetting = await SystemSettings.findOne({
        where: { key: "usersStartingBalance" },
      });
      const initialBalance = balanceSetting.value;

      await Wallet.create({
        citizenId: citizen.id,
        balance: initialBalance,
      });
      const user = await Citizen.findOne({
        where: { id: citizen.id },
        include: [
          {
            model: Wallet,
            as: "wallet",
            attributes: ["balance"],
          },
        ],
      });

      return responseObject(res, 201, "success", user);
    });
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
