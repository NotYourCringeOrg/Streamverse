const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const User = require('../models/User.model');

router.post("/addfavorite", checkAuth, (req, res) => {
    const userId = req.userData.userId;
    const audioId = req.body.id;

    User.findByIdAndUpdate(userId,{
        $addToSet:{audioFavorites:audioId}
      })
    .then(
        (result)=>{console.log(result)
        res.status(200).json("Added to favorites")}
    )
    .catch((err)=>{
        console.log(err);
        res.send(err);
    })
})

router.post("/removefavorite", checkAuth, (req, res) => {
    const userId = req.userData.userId;
    const audioId = req.body.id;
    User.findByIdAndUpdate(userId,{
        $pull:{audioFavorites:audioId},
      })
    .then(
        res.status(200).json("Removed from favorites")
    )
    .catch((err)=>{
        console.log(err);
    })
})

router.post("/getaudiodata", checkAuth, async (req,res)=>{
    const userId = req.userData.userId;
    const audioId = req.body.id;
    try {
        const user = await User.find({_id:userId})
        
        let isFavorite = false;
        if(user[0].audioFavorites.includes(audioId)) isFavorite = true;
    
        res.status(200).json({isFavorite});
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
})

module.exports = router