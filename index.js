const express = require ("express")
const app = express();
const User = require('./schemas/UserSchema')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose")





app.use(express.json())



app.post('/signup',(req,res)=> {

    User.findOne({email:req.body.email}).then((data)=> {
        if(data) {
            res.json({
                message:"user already exist"
            })
        }

        else {

            bcrypt.hash(req.body.password, 10, function(err, hash) {
                req.body.password = hash

                const user = new User(req.body)

                user.save()
    
                res.json({
                    message:"user created successfully"
                })
            });



           
        }
    })
    


})


app.post('/signin',(req,res,next)=> {

    User.findOne({email:req.body.email}).then((data)=> {
        if(data) {
            bcrypt.compare(req.body.password, data.password, function(err, result) {
                if(result == true) {
                    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

                res.json({
                    message:"user successfully signed in",
                    token:token
                })
                }
                
                else {
                    next(new Error("Incorrect Username or Password"))
                }


            });
        }

        else {
            res.json({
                message:"No User Found",
                condition:false
            })
        }
    })

})


app.listen(8090,()=> {
    console.log("Server started at port 8090")
})


mongoose.connect('mongodb+srv://vighnesh10:7YaykjGhe40DRrb4@cluster0.4klbrmd.mongodb.net/').then(()=> {
    console.log('database connected')
})