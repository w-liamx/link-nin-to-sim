import db from "../models/index.js";
import { responseObject } from "../helpers/utils.js";
import { validatePhoneNumber, validateNIN } from "../helpers/validators.js";

const SimRegistration = db.SimRegistration;
const Wallet = db.Wallet;
const Citizen = db.CitizensNin;
const RequestReport = db.RequestsReport;
const SystemSettings = db.SystemSetting;

const reportRemarks = [
  "Successful",
  "Invalid Phone Number",
  "Invalid NIN",
  "Invalid Phone Number and NIN",
  "Insufficient Fund",
  "Redundant Request",
];

export const linkPhoneToNin = async (req, res) => {
  try {
    const { phoneNumber, nin } = req.body;

    // Check if provided phone number is valid
    if (!validatePhoneNumber(phoneNumber))
      return responseObject(res, 400, "error", null, "Invalid Phone number");

    // Check if provided NIN is valid
    if (!validateNIN(nin))
      return responseObject(res, 400, "error", null, "Invalid NIN");

    // Convert phone number with country code to local phone number to protect database integrity
    let phone = phoneNumber;
    if (phoneNumber.substring(0, 4) === "+234")
      phone = phoneNumber.substring(4).replace(/^/, "0");
    if (phoneNumber.substring(0, 3) === "234")
      phone = phoneNumber.substring(3).replace(/^/, "0");

    /**
     *To successfully link NIN to Phone Number, User Must Provide A Valid Phone Number
     * Assuming we have access to Users sim card registration records/database...
     * Here, we check the phone Number provided by the user in the sim registration database
     * to make sure that the user has provided a valid sim card number.
     *
     * User Must Provide A Valid NIN
     * Also assuming we have access to Users NIN registrations records/database...
     * We check the NIN provided by the user in the NIN registrations database to
     * make sure that the user has provided a valid NIN
     *
     * If the two conditions above are met,
     * We assume we have a wallet system, and the default currency is Naira,
     * Since it is mandatory to charge each user N500 (or #amount specified in database) per request
     * we have to check if the user's wallet balance is enough to bear the charges for his/her request.
     *
     * If all conditions are met,
     * We establish a link between the specified phone number and NIN
     */

    if (!phoneNumber || !nin)
      return responseObject(
        res,
        400,
        "error",
        null,
        "Both fields are required! Please provide your phone number and NIN."
      );
    const sim = await SimRegistration.findOne({
      where: { phoneNumber: phone },
    });

    // Return response messages if phone number is already linked to NIN
    // This only shows a message suggesting to the user to contact support. The administrators should then ask user to verify his/her account so that the record can be updated.
    if (sim && sim.nin) {
      await RequestReport.create({
        nin,
        phoneNumber,
        status: "fail",
        amountBilled: 0,
        remark: reportRemarks[5],
      });
      return responseObject(
        res,
        403,
        "error",
        null,
        "This Phone number has already been Linked to an NIN. Please contact support if you are not aware of this linking."
      );
    }

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

    // Return corresponding response messages if user's inputs are invalid
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
        "Please provide a valid Phone number and NIN. If you have forgotten or lost them, kindly obtain your phone number from your service provider, and your NIN from the NIN database"
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
        "You have provided an Invalid NIN. This may be due to a typographical error or that you have not registered for NIN. Please confirm that your NIN is correct by searching in the NIN database."
      );
    }

    // If User's inputs are valid, Get the current charge per request. Use default of N500 if setting is not found.
    const chargeSetting = await SystemSettings.findOne({
      where: { key: "chargePerRequest" },
    });
    const currentChargePerRequest = chargeSetting.value || 500;

    // check if user has a wallet and has enough balance for this request
    if (citizen.wallet.balance < currentChargePerRequest) {
      await RequestReport.create({
        nin,
        phoneNumber,
        status: "fail",
        amountBilled: 0,
        remark: reportRemarks[4],
      });
      return responseObject(
        res,
        402,
        "error",
        null,
        `You do not have sufficient balance to make this request. You need up to N${currentChargePerRequest} in your wallet, your current balance is N${citizen.wallet.balance}. Please credit your wallet.`
      );
    } else {
        await SimRegistration.update(
      { nin: citizen.nin },
      {
        where: {
          phoneNumber: phone,
        },
      }
    ).then(async ()=>{
      await Wallet.update(
      {
        balance: citizen.wallet.balance - currentChargePerRequest,
      },
      {
        where: {
          citizenId: citizen.id,
        },
      }
    );
    }).then(async ()=>{
      await RequestReport.create({
      nin,
      phoneNumber,
      status: "success",
      amountBilled: currentChargePerRequest,
      remark: reportRemarks[0],
    });
      return responseObject(
      res,
      202,
      "success",
      null,
      "Congratulations! You have successfully linked your phone number to your NIN"
    );
    })
    }
    
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};

export const getRequestReports = async (req, res) => {
  try {
    const reports = await RequestReport.findAll({ limit: 50, offset: 0 });

    const data = {
      reports: reports,
      statistics: {
        totalAmountBilled: await RequestReport.sum("amountBilled"),
        totalUsersBalance: await Wallet.sum("balance"),
      },
    };

    return responseObject(res, 200, "success", data);
  } catch (err) {
    return responseObject(res, 500, "error", null, err.message);
  }
};
