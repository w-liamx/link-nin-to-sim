import db from "../models/index.js";
import { responseObject } from "../helpers/utils.js";

const SimRegistration = db.SimRegistration;
const Citizen = db.CitizensNin;
const RequestReport = db.RequestsReport;

const reportRemarks = [
  "Successful",
  "Invalid Phone Number",
  "Invalid NIN",
  "Invalid Phone Number and NIN",
  "Insufficient Fund",
];

export const linkPhoneToNin = async (req, res) => {
  try {
    const { phoneNumber, nin } = req.body;

    /**
     * User Must Provide A Valid Phone Number
     * Assuming we have access to Users sim card registration records/database...
     * Here, we check the phone Number provided by the user in the sim registration database
     * to make sure that the user has provided a valid sim card.
     *
     * User Must Provide A Valid NIN
     * Also assuming we have access to Users NIN registrations records/database...
     * We check the NIN provided by the user in the NIN registrations database to
     * make sure that the user has provided a valid NIN
     *
     * If the two conditions above are met,
     * Assuming we have a wallet system, and the default currency is Naira,
     * Since it is mandatory to charge each user N500 (or #amount specified in database) per request
     * we have to check it the user's wallet balance is enough to bear the charges for his/her request.
     *
     * If all conditions are met,
     * We establish a link between the specified phone number and NIN
     */

    const sim = await SimRegistration.findOne({
      where: { phoneNumber },
    });

    // Fetch citizen's record and LEFT JOIN wallet
    const citizen = await Citizen.findOne({
      where: { nin },
      include: [
        {
          model: Wallet,
          as: "wallet",
          attributes: ["balance"],
        },
      ],
    });

    // Return response messages if user's inputs are invalid
    if (!sim && !citizen) {
      await RequestReport.create({
        nin,
        phoneNumber,
        status: "fail",
        amountBilled: 0,
        remark: reportRemarks[3],
      });
      return responseObject(
        res,
        400,
        "error",
        null,
        "Please provide a valid Phone number and NIN. If you are not sure, you can obtain your phone \
        number from your service provider, and your NIN from the NIN database"
      );
    } else if (!sim && citizen) {
      await RequestReport.create({
        nin,
        phoneNumber,
        status: "fail",
        amountBilled: 0,
        remark: reportRemarks[1],
      });
      return responseObject(
        res,
        400,
        "error",
        null,
        "You have provided an Invalid Phone number. Make sure your phone number is correct and is Registered"
      );
    } else if (sim && !citizen) {
      await RequestReport.create({
        nin,
        phoneNumber,
        status: "fail",
        amountBilled: 0,
        remark: reportRemarks[2],
      });
      return responseObject(
        res,
        400,
        "error",
        null,
        "You have provided an Invalid NIN. This may be due to a typographical error or you have not registered for NIN. \
        Please confirm that your NIN is correct by searching in the NIN database."
      );
    }

    // Get the current charge per request
    const chargeSetting = await SystemSettings.findOne({
      where: { key: "chargePerRequest" },
    });
    const currentChargePerRequest = chargeSetting.value;

    // check if user has a wallet and has enough balance for this request
    if (citizen.wallet.balance >= currentChargePerRequest) {
      await SimRegistration.update({ nin: citizen.nin });
      await RequestReport.create({
        nin,
        phoneNumber,
        status: "success",
        amountBilled: currentChargePerRequest,
        remark: reportRemarks[0],
      });
      return responseObject(
        res,
        200,
        "success",
        null,
        "Congratulations! You have successfully linked your phone number to your NIN"
      );
    } else {
      await RequestReport.create({
        nin,
        phoneNumber,
        status: "success",
        amountBilled: currentChargePerRequest,
        remark: reportRemarks[0],
      });
      return responseObject(
        res,
        403,
        "error",
        null,
        "You do not have sufficient balance to make this request. Please credit your wallet."
      );
    }
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};

export const getRequestReports = async (req, res) => {
  try {
    const reports = await RequestReport.findAll();

    const data = {
      reports: reports,
      statistics: {
        totalAmountBilled: "4000",
        totalUsersBalance: "5000",
      },
    };

    return responseObject(res, 200, "success", data);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};
