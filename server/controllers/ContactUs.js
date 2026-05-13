const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");
const Contact = require("../models/Contact"); // import the model

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
  console.log(req.body);
  try {
    // Send Email
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
    console.log("Email Res ", emailRes);

    // Save contact data to DB
    await Contact.create({
      firstname,
      lastname,
      email,
      phoneNo,
      countrycode,
      message,
    });

    return res.json({
      success: true,
      message: "Contact Us Email sent and data saved successfully",
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending or saving data",
    });
  }
};
