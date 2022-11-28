module.exports = {
    paymentgateway : (process.env.IP)? "http://"+process.env.IP+":8089/paybroadband":"http://localhost:8089/paybroadband"
}