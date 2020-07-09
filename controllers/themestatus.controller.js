var Themestatus = require('../models/themestatus.models');

module.exports.getDataTheme = async (req, res) => {
    await Themestatus.find({}, (err, data) => {
        if(err) {
            res.json({
                success: false,
                msg: "Failed to add author"
              }); 
        }else{
            res.render('./admin/layoutadmin/themestatus',{themes:data});
            // res.send(data);
        }
    });
};

module.exports.postTheme = async (req, res) => {
    let newTheme = await new Themestatus({
        themestatus: req.file.filename
    });
    await newTheme.save((err, data) => {
        if(err) {
        res.json({
            success: false,
            msg: "Failed to add author"
        });
        } else {
            res.redirect('theme');
        }
    });
};

module.exports.deleteTheme = async (req, res) => {
    await Themestatus.findByIdAndDelete({_id: req.params.id}, function(err, posts) {
        if (err) throw err;
        res.redirect('/admin/theme');
    });
};