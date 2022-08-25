const db = require('../models/db.model');
const EmailService = require('../service/sendEmail');
const UserModel = db.User;
const OrderModel = db.Order;
const OrderDetailModel = db.OrderDetail;
const CartModel = db.Cart;
const PaymentModel = db.Payment;

const addNewPayment = async (req, res) => {
    const { fullName, phone, address, email, listItems, totalBill, idUser, method } = req.body;

    const t = await db.sequelize.transaction();

    try {

        // update infomation of user
        await UserModel.update({ fullName: fullName, phone: phone, address: address }, {
            where: {
                id: idUser,
            },
        })

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
        const createdPayment = await PaymentModel.create({
            method: method,
            orderId: createdOrder.id,
            total: totalBill
        },
            { transaction: t }
        )

        // delete all Cart item after done
        await CartModel.destroy(
            {
                where: { id: deletedCartIds }
            },
            { transaction: t }
        )

        // commit transaction
        await t.commit()

        // contunied sending email
        await EmailService(
            `${email}`,
            'SUCCESSFULLY CHECKOUT!',
            `Thank you for ordering at our shop!
            Payment Details:

        ########################################################
        PaymentID: ${createdPayment.id}
        Payment Method: ${createdPayment.method}
        Paid: ${createdPayment.total} VND
        ########################################################

        Good luck and have fun!
        Men Fashion Shop`
        )

        return res.status(201).json({
            createdPayment
        })

    } catch (error) {
        await t.rollback();
        return res.status(500).json({ message: "Error" })
    }
}

const getPayment = async (req, res) => {
    const orderId = req.params.id;

    try {
        const payment = await PaymentModel.findOne({
            where: {
                orderId: orderId,
            }
        })

        if (!payment) {
            return res.status(404).json({ message: "Not found payment" })
        }

        return res.status(200).json(payment)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    addNewPayment,
    getPayment
}