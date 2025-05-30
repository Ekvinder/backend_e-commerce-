const { Router } = require("express");
const stripe =require("stripe")(
    "sk_test_51QISBgDxMdd0OOSnDBTk4OyzdX9QrM3KqPY2KuRiGjVMSH3airoSpHBCyhhGTYPb0nh4VjnBJxjJEXDxDgPnISv600I5CXkIdI"
);


const paymentRoute = Router()

paymentRoute.get("/payment",(req,res) =>{
    res.render("teststripeform")
})

// paymentRoute.post("/postPayment",(req,res) =>{
//     res.render("teststripeform")
// })

paymentRoute.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:1234/success',
      cancel_url: 'http://localhost:1234',
    });
  
    res.redirect(303, session.url);
  });

module.exports = paymentRoute