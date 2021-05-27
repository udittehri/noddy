const mongoose = require('mongoose');
const messages = require('../../common/messages');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, messages.FULL_NAME_REQUIRED],
    },
    userId: {
        type: String
    },
    picture: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    price: {
        type: Number,
        required: false
    },
    description: {
        type: Number,
        required: false,
        sparse: true
    },
    status: {
        type: Number,
        enum: [0, 1],  // 0 - DISABLE 1 - ABLE
        default: 1
    },
    tag: {
        type: String,
        required: false
    },

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Products', schema);
