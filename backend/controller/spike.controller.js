const db = require('../models/db.model');
const EmailService = require('../service/sendEmail');
const UserModel = db.User;
const OrderModel = db.Order;
const OrderDetailModel = db.OrderDetail;
const CartModel = db.Cart;
const PaymentModel = db.Payment;

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    appInfo: { // For sample support and debugging, not required for production:
        name: "stripe-samples/accept-a-payment/custom-payment-flow",
        version: "0.0.2",
        url: "https://github.com/stripe-samples"
    }
});

const getConfig = (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
}
const creatPayment = async (req, res, next) => {
    const { paymentMethodType, currency, amount, listItems, email, idUser } = req.body;

    // Each payment method type has support for different currencies. In order to
    // support many payment method types and several currencies, this server
    // endpoint accepts both the payment method type and the currency as
    // parameters.
    //
    // Some example payment method types include `card`, `ideal`, and `alipay`.
    const params = {
        payment_method_types: [paymentMethodType],
        amount,
        currency: currency,
    }

    // Create a PaymentIntent with the amount, currency, and a payment method type.
    //
    // See the documentation [0] for the full list of supported parameters.
    //
    // [0] https://stripe.com/docs/api/payment_intents/create
    try {
        const paymentIntent = await stripe.paymentIntents.create(params);
        console.log(paymentIntent.client_secret  )
        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret,
            nextAction: paymentIntent.next_action,
        });
        next()
    } catch (e) {
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
}

const payment = async(req,res)=>{
    const { paymentMethodType,amount, listItems, email, idUser } = req.body;

    //transaction
    const t = await db.sequelize.transaction();
    try {
             // create order
             const createdOrder = await OrderModel.create(
                {
                    userId: idUser,
                },
                { transaction: t }
            )
            // create list of orderdetail and list of deletedCartIds
            const orderDetailBulkData = [];
            const deletedCartIds = [];
    
            listItems.forEach((item) => {
                orderDetailBulkData.push({
                    orderId: createdOrder.id,
                    productId: item.productId,
                    quantityProduct: item.qty
                });
                deletedCartIds.push(item.cartId)
            });
    
            await OrderDetailModel.bulkCreate(orderDetailBulkData, { transaction: t });
    
            // create payment
            const total = (amount / 100);
            const createdPayment = await PaymentModel.create({
                method: paymentMethodType,
                orderId: createdOrder.id,
                total: total,
            },
                { transaction: t })
    
    
            // delete all Cart item after done
            await CartModel.destroy(
                {
                    where: { id: deletedCartIds }
                },
                { transaction: t })
            await t.commit()
    
            // contunied sending email
            await EmailService(
                `${email}`,
                'SUCCESSFULLY CHECKOUT!',
                `Thank you for ordering at our shop!
                Payment Details:
    
            ########################################################
            PaymentID: ${createdPayment.id}
            Payment Method: ${paymentMethodType}
            Paid: ${amount} USD
            ########################################################
    
            Good luck and have fun!
            Men Fashion Shop`
            )
    
            
    
    } catch (error) {
        await t.rollback();
        return res.status(400).send({
            error: {
                message: e.message,
            },
        });
    }
}
module.exports = { getConfig, creatPayment, payment }