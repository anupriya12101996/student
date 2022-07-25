const mongoose = require("mongoose");

const addStudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: String, required: true },
    school: { type: String, required: true },
    class: { type: String, required: true },
    division: { type: String, required: true },
    status: { type: String, required: true },
});

//now we need to create a collection
const AddStudent = new mongoose.model("student", addStudentSchema);
module.exports = AddStudent;