const {model, Schema, models} = require("mongoose");

const AdminSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

module.exports = models.Admin || model("Admin", AdminSchema);