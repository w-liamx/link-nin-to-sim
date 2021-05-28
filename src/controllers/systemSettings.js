import db from "../models/index.js";
import { responseObject, validateAmount } from "../helpers/utils.js";

const SystemSettings = db.SystemSetting;

export const updateSystemSettings = async (req, res) => {
  try {
    const { chargePerRequest, usersStartingBalance } = req.body;

    if (!chargePerRequest && !usersStartingBalance)
      return responseObject(res, 400, "error", null, "Invalid Input(s)");

    let data = {
      SystemSettings: null,
    };

    if (chargePerRequest) {
      if (!validateAmount(chargePerRequest))
        return responseObject(
          res,
          400,
          "error",
          null,
          "Invalid Input for 'chargePerRequest' field"
        );

      const val1 = Number(chargePerRequest);
      await SystemSettings.update(
        { value: val1 },
        {
          where: {
            key: "chargePerRequest",
          },
        }
      ).then(
        async () => (data.SystemSettings = await SystemSettings.findAll())
      );
    }

    if (usersStartingBalance) {
      if (!validateAmount(usersStartingBalance))
        return responseObject(
          res,
          400,
          "error",
          null,
          "Invalid Input 'usersStartingBalance' field"
        );

      const val2 = Number(usersStartingBalance);
      await SystemSettings.update(
        { value: val2 },
        {
          where: {
            key: "usersStartingBalance",
          },
        }
      ).then(
        async () => (data.SystemSettings = await SystemSettings.findAll())
      );
    }

    return responseObject(res, 200, "success", data);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};

export const getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findAll();

    return responseObject(res, 200, "success", settings);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};
