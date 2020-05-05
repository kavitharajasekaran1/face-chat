const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const person_details = new Schema({
    firstname: String,
    lastname:String,
    email: String,
    mobileNo: String,
    password: String,
    groupname: String,
    url:String,
    meetingID:Number,
    signin:{type:String,default:false},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    
});
const PersonDetails = mongoose.model('personDetails', person_details);

module.exports={
    PersonDetails : PersonDetails
}