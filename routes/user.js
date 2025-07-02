const { Router } = require("express");
const userRouter = Router();
const { userModel, purchaseModel, courseModel } = require("../db");
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_USER_Secret} = require("../config");
const course = require("./course");



userRouter.post("/signup", async function(req, res) {
    
    const bodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string(),
        lastName: z.string()
    })

    
    try{

        const { email, password, firstName, lastName } = bodySchema.parse(req.body);
        
        const hasshedPassword = await bcrypt.hash(password, 5);
        
        await userModel.create({
            email: email,
            password: hasshedPassword,
            firstName: firstName,
            lastName: lastName
        })
        


        res.json({
        message: "SingnUp Successful"
        })

    }catch(err){
        console.error("SignUp Error ", err)
        res.status(500).send({
            error: "SignUp Failed"
        })
    }
    
    
});


userRouter.post("/signin", async function(req, res) {

    const bodySchema = z.object({
        email: z.string().email(),
        password: z.string()
    })


    try{

        const { email, password } = bodySchema.parse(req.body);
        const user = await userModel.findOne({
            email: email,
        })
        
        
        const matchPassword = await bcrypt.compare(password, user.password)
        

        if(matchPassword) {
        const token = jwt.sign({
            id: user._id,
        }, JWT_USER_Secret);
        res.json({
            token: token
        });
        }else{
            res.json({
                error: "Invalid Credentials"
            })
        }
    }catch(err){
        console.error("Sign In error: ", err)
        res.status(401).send({
            error: "LogIn Failed"
        })

    }

    // We can also add cookies and session based authentication
    
});

userRouter.get("/purchased", async function(req, res) {
    const userId = req.userId;

    // Ideally it should check weather payment has done by user or not
    const purchases = await purchaseModel.find({
        userId
    });

    let coursePurchasedIds = [];

    for(let i = 0; i<purchases.length; i++){
        coursePurchasedIds.push(purchases[i].courseId)
    }

    const courseData = await courseModel.find({
        _id: { $in: coursePurchasedIds}
    })

    res.send({
        purchases,
        courseData
    })
});


module.exports = {
    userRouter: userRouter
}