var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MovieSchema = new Schema({
 title: String,
 imgUrl: String,
 description: String,
 xxi: String,
 cgv: String
});

mongoose.model('Movie', MovieSchema);
