"use strict";
const crypto = require("crypto")
const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
const BackupSchema = new Schema({
    id: {
        type: 'UUID',
        default: () => crypto.randomUUID()
    },
    device: {
        type: Map,
        of: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
    source: {
        type: [String],
        trim: true,
        required: true,
    },
    error_message: {
        type: [String]
    },
    transferred_files: {
        type: Number
    },
    created_files: {
        type: Number,
    },
    total_files: {
        type: Number,
    },
    warning_messages: {
        type: [String]
    },
    process: {
        pid: {
            type: Number
        },
        name: {
            type: String
        },
        killed: {
            type: Boolean,
            default: false
        }
    },
    status: {
        type: String,
        default: "running",
        validate: {
            validator: (value) => ["running", "done", "error", "done_with_warnings"].includes(value),
            message: "Valid status values are: done, error, warning"
        }
    },
    dest: {
        type: String,
        trim: true,
        required: true,
    },
    size: {
        type: Number,
        required: true
    },
    size_formatted: {
        type: String,
        required: false,
    },
    updated: {
        type: Date,

    },
    finished: {
        type: Date,

    },
    created: {
        type: Date,
        default: Date.now,
    },
});


mongoose.model("Backup", BackupSchema);
