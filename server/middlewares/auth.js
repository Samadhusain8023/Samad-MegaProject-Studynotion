const jwt = require("jsonwebtoken");
const User = require("../models/User")
require("dotenv").config();

// Authorization

exports.auth = async (req, res, next) => {
    try{

        // console.log("BEFORE ToKEN EXTRACTION");
        // console.log("cookies me se token->",req.cookies.token);
        // console.log("body me se token->",req.body.token );
        // console.log("header me se token->",req.header("Authorization"));
    


        //extract token
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorization").replace("Bearer ", "");
        // console.log("AFTER ToKEN EXTRACTION");

        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }

        //verify the token
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}


// isStudent 
exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.accountType !=="Student")
        {
            return res.status(401).json({
                success:false,
                message:`This is a protected route for Students only`,

            });
        }
        next();

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })

    }
}


//isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Instructor") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Instructor only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }