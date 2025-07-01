const { mongoose, model } = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
});

const adminSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
});

const courseSchema = new Schema({
    tittle: String,
    discription: String,
    price: Number,
    ImageUrl: String,
    createrId: ObjectId
});

const purchaseSchema = new Schema({
    courseId: ObjectId,
    userId: ObjectId
});



const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}