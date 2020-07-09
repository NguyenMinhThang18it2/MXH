var Profile = require('../../models/profile.models');

module.exports.getProfile = async (req, res)=>{
    await Profile.findOne({_id: req.params.id}, async (err, data)=>{
        if(err) throw err;
        else{
            res.send(data);
        }
    });
};
//
module.exports.postsProfile = async (req, res)=>{
    let newProfile = await new Profile({
        iduser: req.params.id,
        profile:{
            gender: req.body.gender,
            phone: req.body.phone,
            dateofbirth: req.body.dateofbirth,
            nickname: req.body.nickname
        },
        education:{
            typeeducation: req.body.typeeducation,
            school: req.body.school
        },
        placeslive: req.body.placeslive,
        from: req.body.from,
        job: req.body.job,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    await newProfile.save(async (err, data)=>{
        if(err){
            res.json({
                success: false,
                msg: "lỗi"
            });
        }else{
            res.json({
                success: true,
                msg: "thành công"
            });
        }
    });
};