const express = require('express');
const router = express.Router();

const Item = require('../../models/Item');

router.get('/', (req, res) => {
    Item.find()
        .sort({ date: -1 })
        .then(items => res.json(items));
});

//@route POST api/items/
//@desc Add an item
//@access public - todo make private after implementing login
router.post('/', (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });

    newItem.save().then(item => res.json(item));
});

//@route DELETE api/items/:id
//@desc Delete an item
//@access public - todo make private after implementing login
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id).then(item =>
        item.remove().then(() => res.json({ success: true }))
    ).catch(err => res.status(404).json({ success: false }));
});


module.exports =  router;
