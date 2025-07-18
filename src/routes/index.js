// const UserRouter = require('./UserRouter')
// const ProductRouter = require('./ProductRouter')
// const ChatBotRouter = require('./ChatBotRouter');
// const OrderRouter = require('./OrderRouter')

// const routes = (app) => {
//     app.use('/api/user', UserRouter)
//     app.use('/api/product', ProductRouter)
//     app.use('/api/chatbot', ChatBotRouter);
//     app.use('/api/order', OrderRouter)
// }

// module.exports = routes

const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')
const chatbotRouter = require("./ChatBotRouter");

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/payment', PaymentRouter)
    app.use("/api/chatbot", chatbotRouter);
}

module.exports = routes