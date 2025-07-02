const {Router} = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_Secret} = require("../config");
const { adminMiddleWare } = require("../middleware/admin");
const course = require("./course");



adminRouter.post("/signup", async function(req, res) {

    const bodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string(),
        lastName: z.string()    
    })

    try{

        const { email, password, firstName, lastName } = bodySchema.parse(req.body);
        
        const hasshedPassword = await bcrypt.hash(password, 5);
        
        await adminModel.create({
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

adminRouter.post("/signin", async function(req, res) {
    
    const bodySchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    try{

        const { email, password } = bodySchema.parse(req.body);
        const user = await adminModel.findOne({
            email: email,
        })
        
        //console.log('Hi there 01')
        const matchPassword = await bcrypt.compare(password, user.password);
        // console.log("Hi there 02")

        if(matchPassword) {
            const token = jwt.sign({
                id: user._id,
            }, JWT_ADMIN_Secret);
            res.json({
                token: token
            });
        }
    }catch(err){
        console.error("Sign In error: ", err)
        res.status(401).send({
            error: "LogIn Failed"
        })

    }
});

adminRouter.post("/createcourse", adminMiddleWare, async function(req, res) {
    const adminId = req.adminId;

    const { tittle, discription, ImageUrl, price} = req.body;

    try{
        const course = await courseModel.create({
        tittle: tittle,
        discription: discription,
        ImageUrl: ImageUrl,
        price: price,
        creatorId: adminId
        })

        res.json({
            message: "Course Created Successfully",
            courseId: course._id
        })
    }catch(err){
        console.error("Error: ", err)
        res.status(500).send({
            message: "Something went wrong"
        })
    }
    
});


adminRouter.put("/update", adminMiddleWare, async function(req, res) {
    const adminId = req.adminId;

    const {tittle, description, ImageUrl, price, courseId } = req.body;

    const course  = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId

    },{
        tittle: tittle,
        description: description,
        ImageUrl: ImageUrl,
        price: price, 
    });

    res.json({
        message: "Course Updated",
        courseId: courseId
    })
});

adminRouter.get("/allcreatedcourses", adminMiddleWare, async function(req, res) {
    const adminId = req.adminId;

    const courses = await courseModel.find({
        creatorId: adminId
    })

    res.json({
        message: "ALL individuls courses created by creators",
        courses
    })
})

adminRouter.delete("/delete", adminMiddleWare, function(req, res) {

});

module.exports = {
    adminRouter: adminRouter
};