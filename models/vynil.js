const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const VynilSchema = new Schema({
//     artist: {
//         type: 'String',
//         required: true
//     },
//     name: {
//         type: 'String',
//         required: true
//     },
//     label: {
//         type: 'String'
//     },
//     country: {
//         type: 'String'
//     },
//     genre: {
//         type: 'String'
//     },
//     style: {
//         type: 'String'
//     },
//     released: {
//         type: 'String'
//     }
// });

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = Item = mongoose.model('item', ItemSchema);
