const mongoose = require('mongoose');

const FieldingPointsSchema = new mongoose.Schema({
    format: String,
    catch: Number,
    runOutThrower: Number,
    stumping: Number,
});

const FieldingPoints = mongoose.model('FieldingPoints', FieldingPointsSchema);

module.exports = FieldingPoints;
