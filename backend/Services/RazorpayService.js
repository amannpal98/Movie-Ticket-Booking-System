// Razorpay payment verification middleware/service
const crypto = require('crypto');

function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
    const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(orderId + '|' + paymentId)
        .digest('hex');
    return generatedSignature === signature;
}

module.exports = { verifyRazorpaySignature };
