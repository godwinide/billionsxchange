const { model, Schema, models } = require("mongoose");

const HistorySchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

module.exports = models.History || model("History", HistorySchema);