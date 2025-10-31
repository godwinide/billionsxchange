const { model, Schema, models } = require("mongoose");

const SiteSchema = new Schema({
    bitcoinAddress: {
        type: String,
        required: false
    },
    bchAddress: {
        type: String,
        required: false
    },
    ethereumAddress: {
        type: String,
        required: false
    },
    usdtAddress: {
        type: String,
        required: false
    },
    whatsappNumber: {
        type: String,
        required: false
    }
});

module.exports = models.Site || model("Site", SiteSchema);