const crypto = require('crypto');
const safeCompare = require('safe-compare');
const dotenv = require('dotenv');
dotenv.config();
const {SHOPIFY_API_SECRET_KEY} = process.env;
function validateWebhook(ctx) {
  console.log('Webhook: New product in the store');
  const hmacHeader = ctx.get('X-Shopify-Hmac-Sha256');
  const body = ctx.request.rawBody;
  const generatedHash = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET_KEY)
    .update(body, 'utf8', 'hex')
    .digest('base64');
  if (safeCompare(generatedHash === hmacHeader)) {
    console.log('Success, webhook came from Shopify');
    ctx.res.statusCode = 200;
    return;
  } else {
    console.log('Fail, webhook not from Shopify');
    ctx.res.statusCode = 403;
    return;
  }
}
module.exports = validateWebhook;
