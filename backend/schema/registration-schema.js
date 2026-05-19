const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: { type: String, required: true, index: true },

    alternatePhone: { type: String },

    dob: {
        type: Date,
        required: true,
        validate: {
            validator: v => v < new Date(),
            message: "DOB must be in the past"
        }
    },

    address: { type: String, required: true, trim: true },

    city: { type: String, required: true, trim: true },

    state: { type: String, required: true, trim: true },

    zip: {
        type: String,
        required: true,
        match: [/^[0-9]{6}$/, "Invalid ZIP code"]
    },

    aadharNumber: {
        type: String,
        required: true,
        unique: true,
        select: false,
        index: true
    },

    naatTitle: { type: String, required: true, trim: true },

    group: {
        type: String,
        enum: ['Jr.', 'Middle', 'Sr'],
        required: true
    },

    photo: { type: String, required: true },
    proof: { type: String, required: true },
    transactionProof: { type: String, required: true },

    candidateRegId: {
        type: String,
        unique: true,
        default: () => `REG-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    },

    payment: {
        transactionId: { type: String, required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },

    registrationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    scores: [
        {
            judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
            judgeName: String,
            cat1: { type: Number, min: 0, max: 10, default: 0 },
            cat2: { type: Number, min: 0, max: 10, default: 0 },
            cat3: { type: Number, min: 0, max: 10, default: 0 },
            cat4: { type: Number, min: 0, max: 10, default: 0 },
            cat5: { type: Number, min: 0, max: 10, default: 0 },
            totalScore: { type: Number, min: 0, max: 50, default: 0 },
            comments: String
        }
    ],

    isRound2Selected: {
        type: Boolean,
        default: false
    },
    isRound1Rejected: {
        type: Boolean,
        default: false
    },
    reason: String,
    finalRoundNaat: {
        type: String,
        default: ""
    }

}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);