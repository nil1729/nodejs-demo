const mongoose = require('mongoose');
const studentSchema = mongoose.Schema({
    marks__s1:{
        type: Number,
        required: true,
    },
    marks__s2:{
        type: Number,
        required: true,
    },
    marks__s3:{
        type: Number,
        required: true,
    },
    marks__s4:{
        type: Number,
        required: true,
    },
    marks__s5:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    class:{
        type: Number,
        required: true
    },
    school_id: {
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model('Student', studentSchema);