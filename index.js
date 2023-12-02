const express = require ("express")
const app = express();
const User = require('./schemas/UserSchema')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose")
const cors = require('cors')




//cross origin
app.use(cors())


app.use(express.json())


// sign up request handling
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

//authentication sign in handler
app.post('/signin',(req,res,next)=> {

    User.findOne({email:req.body.email}).then((data)=> {
        if(data) {

            // comparing the password with the existing password in the database
            bcrypt.compare(req.body.password, data.password, function(err, result) {
                if(result == true) {
                    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

                res.json({
                    message:"user successfully signed in",
                    //token sent
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


app.put('/update',(req,res)=> {
        

    User.updateOne({email:req.body.email},{address:req.body.address}).then((data)=> {
        res.json({
            message:"update successful"
        })
    }).catch((err)=> {
        if(err){
            res.json({
                error:err
            })
        }
    })
})

app.delete('/delete',(req,res)=> {
    User.deleteOne({email:req.body.email}).then((data)=> {
        res.json({
            message:"user deleted successfully"
        })
    })
})




//connecting server
app.listen(8090,()=> {
    console.log("Server started at port 8090")
})

// connecting database
mongoose.connect('mongodb+srv://vighnesh10:7YaykjGhe40DRrb4@cluster0.4klbrmd.mongodb.net/').then(()=> {
    console.log('database connected')
})





