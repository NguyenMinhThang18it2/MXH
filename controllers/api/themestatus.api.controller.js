var Themestatus = require('../../models/themestatus.models');

module.exports.getTheme = async (req, res) => {
    await Themestatus.find({}, async (err, data) => {
        if (err) return handleError(err);
        res.send(data);
    });
};