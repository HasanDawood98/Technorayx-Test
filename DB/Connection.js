const mongoose = require('mongoose');



mongoose.connect("mongodb+srv://hasan:supernova@cluster0.a7jsy.mongodb.net/Technorayx?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('connected to db');
})
.catch((err) => {
    console.log(err);
});

module.exports = mongoose.Connection;

