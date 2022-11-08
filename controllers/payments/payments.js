const stripe = require("stripe")(process.env.STRIPESECRETTEST);
const Companies = require("../../models/companies/companies");
const jwt = require("jsonwebtoken");

const handlePayment = async (req, res, next) => {
  let { amount, id, companyId } = req.body;
  const company = await Companies.findById(companyId);

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Something bought",
      payment_method: id,
      confirm: true,
    });
    const payload = {
      _id: companyId,
      companyName: company.companyName,
      companyEmail: company.companyEmail,
      company: true,
      companyPremium: true,
    };
    jwt.sign(payload, "secret", { expiresIn: "1d" }, (err, token) => {
      if (err) console.log(err);
      else {
        return res
          .status(200)
          .json({ message: "Kupnja uspješno obavljena!", token, success: true });
      }
    });
    company.companyPremium = true;
    await company.save();
  } catch (error) {
    console.log("Error", error);
    res.status(404).json({
      message: "Payment failed",
      success: false,
    });
  }
};

exports.handlePayment = handlePayment;
