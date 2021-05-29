/**
 * ============================================
 * Validators
 *
 * Takes in arguments
 * returns true or false
 * ============================================
 */

import { acceptedTelcos, genderDict } from "./constants";

// Returns true if argument is a positive integer
export const validateAmount = (num) => {
  if (!num) return false;
  return Number.isInteger(Number(num)) && Number(num) > 0;
};

export const validatePhoneNumber = (phone) => {
  // Regular expression that validates nigerian phone numbers
  // Accepts 0***, 234***, +234***
  // Only accepts 070, 080, 090, 081
  const regEx = /^[0](7|8|9)(0|1)\d{8}$|^[\+]?(234)(7|8|9)(0|1)\d{8}$/;

  const isValid = regEx.test(phone);
  return isValid;
};

export const validateNIN = (nin) => {
  // Regular expression that validates national identity number
  // Only Accepts 11 digits number
  const regEx = /^\d{11}$/;

  const isValid = regEx.test(nin);
  return isValid;
};

export const validateDOB = (dob) => {
  // Regular expression that validates Date of birth
  // This validation assumes that no person's year of birth can be earlier than 1700
  const regEx =
    /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](17|18|19|20)\d\d$/;
  const isValid = regEx.test(dob);
  return isValid;
};

export const validateTelco = (telco) => {
  const isValid = acceptedTelcos.includes(telco.toUpperCase(), 0);
  return isValid;
};

export const validateGender = (gender) => {
  const isValid = genderDict.includes(gender.toUpperCase(), 0);
  return isValid;
};

/**
 * ============================================
 * END OF VALIDATIONS
 * ============================================
 */
