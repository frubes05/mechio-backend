const stripe = require("stripe")(process.env.STRIPESECRETTEST);

const handlePayment = async (req, res, next) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
        amount,
        currency: "USD",
        description: "Something bought",
        payment_method: id,
        confirm: true
    })
    res.status(200).json({
        message: 'Payment successfull',
        success: true
    })
  } catch (error) {
    console.log('Error', error);
    res.status(404).json({
        message: 'Payment failed',
        success: false
    })
  }
};

exports.handlePayment = handlePayment;
