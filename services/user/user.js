const mongoose = require('mongoose');
const messages = require('../common/messages');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, messages.FULL_NAME_REQUIRED],
    },
    email: {
        type: String,
        required:false,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    picture: {
        type: String,
        required: false,
        default: null
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4], // 1-> Active , 2->Inactive, 3-> Absconded, 4-> Left Organisation
        default: 1
    },
    shopName:{
        type: String,
        required:[true,messages.SHOP_NAME_REQUIRED]
    },
    password_reset_token: String,

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('User', schema);
