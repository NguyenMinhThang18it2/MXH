var Profile = require('../../models/profile.models');

module.exports.getProfile = async (req, res)=>{
    await Profile.findOne({iduser: req.params.id}).populate('iduser').exec( async (err, data)=>{
        if(err) throw err;
        else if(data !== null){
            res.send(data);
        }else{
            res.json({
                success: false,
                msg: "chưa có profile"
            });
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
            studies_at: req.body.studies_at,
            studied_at: req.body.studied_at
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