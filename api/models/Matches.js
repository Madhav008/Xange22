const mongoose = require('mongoose');

const iposchema = new mongoose.Schema({
    id: String,
    success: String,
    fullName: String,
    shortForm: String,
    image: String,
    price: Number,
    changePercent: Number,
    chart: {
        type: [{
            date: String,
            price: Number
        }],
        required: true
    },
    info: {
        type: String,
        required: true
    },
});

const RecentMatches = mongoose.model('ipo', iposchema);

const dummyData = [
    {  success: "true", fullName: "Avengers", shortForm: "Avengers", image: "url", price: 100, changePercent: 20, chart: [{date: "2023-09-23", price: 100}], info: "Match Details"},
    {  success: "false", fullName: "Spiderman", shortForm: "Spiderman", image: "url", price: 200, changePercent: 30, chart: [{date: "2023-09-23", price: 200}], info: "Match Details"},
    {  success: "true", fullName: "Batman", shortForm: "Batman", image: "url", price: 300, changePercent: 40, chart: [{date: "2023-09-23", price: 300}], info: "Match Details"},
];

/* // Insert dummy data
RecentMatches.insertMany(dummyData)
    .then(() => {
        console.log('Dummy data inserted successfully');
    })
    .catch(err => {
        console.log(err.message);
    });
 */
module.exports = RecentMatches;

