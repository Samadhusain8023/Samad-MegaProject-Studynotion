const {instance} = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req,res) => {

    console.log("apan backend me a gye hai")
    
    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0) {
        return res.json({success:false, message:"Please provide Course Id"});
    }

    let totalAmount = 0;

    for(const course_id of courses) {
        let course;
        try{
           
            course = await Course.findById(course_id);
            if(!course) {
                return res.status(200).json({success:false, message:"Could not find the course"});
            }

            //  user ki id ko object id me change krna
            const uid  = new mongoose.Types.ObjectId(userId);

            if(course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({success:false, message:"Student is already Enrolled"});
            }

            totalAmount += course.price;
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    //ab apan order create kr rhe hai
    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

    //ye ek course k liye
//         // get courseId and userId 
//         const { course_id } = req.body;
//         const userId = req.user.id;

//         // validation
//         if(!course_id){
//             return res.status(400).json({
//                 success:false,
//                 message:`Please provide valid course ID`
//             })
//         }

//         let course;
//         // vaid courseDateail
//         try{
//             course = await Course.findById(course_id);
//             if(!course) {
//                 return res.json({
//                     success:false,
//                     message:'Could not find the course',
//                 });
//             }

//              //user already pay for the same course
//             //  user ki id ko object id me change krna
//             const uid =new mongoose.Types.ObjectId(userId);//convert string to objectid

//             if(course.studentEnrolled.includes(uid))
//             {
//                 return res.status(200).json({
//                     success:false,
//                     message:'Student is already enrolled',
//                 });
//             }


//         }
//         catch(error){
//             console.error(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });

//         }

//         // order  create
//         const amount = course.price;
//         const currency = "INR";

//         const option = {
//             amount:amount*100,
//             currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes:{
//                 courseId:course_id,
//                 userId,
//             }
//         };

//         try{
//             //initiate the payment using razorpay
//             const paymentResponse = await instance.orders.create(option);
//             console.log(paymentResponse);

//              //return response
//             return res.status(200).json({
//                 success:true,
//                 courseName:course.courseName,
//                 courseDescription:course.courseDescription,
//                 thumbnail: course.thumbnail,
//                 orderId: paymentResponse.id,
//                 currency:paymentResponse.currency,
//                 amount:paymentResponse.amount,
//             });

//         }
//         catch(error)
//         {
//             console.log(error);
//             res.json({
//                 success:false,
//                 message:"Could not initiate order",
//             });

//         }

// };


// // verify signature of razorpay and server
// exports.verifySignature = async (req,res) =>{
//     const webHookSecret = "123456";

//     const signature = req.headers["x-razorpay-signature"];

//     // imp. 3 steps for encryption of our key
//     const shasum = crypto.createHmac("sha256",webHookSecret);
//     shasum.update(JSON.stringify(req.body));//strinf me convert kr rhe hai apni secretkey ko
//     const digest = shasum.digest("hex");//hexadecimal m convert kr rhe hai

//     if(signature === digest)
//     {
//         console.log("Payment is authorized");
//         // ab action perfoem krenge phle courseid or userid ko order k notes se nikal lenge
//         const {courseId, userId} = req.body.payload.payment.entity.notes;
        
//         try
//         {
//             //fulfil the action

//             //find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                                             {_id: courseId},
//                                             {$push:{studentsEnrolled: userId}},
//                                             {new:true},
//             );

//             if(!enrolledCourse) {
//                 return res.status(500).json({
//                     success:false,
//                     message:'Course not Found',
//                 });
//             }

//             console.log(enrolledCourse);

//             //find the student andadd the course to their list enrolled courses me 
//             const enrolledStudent = await User.findOneAndUpdate(
//                                             {_id:userId},
//                                             {$push:{courses:courseId}},
//                                             {new:true},
//             );

//             console.log(enrolledStudent);

//             //mail send krdo confirmation wala 
//             const emailResponse = await mailSender(
//                                     enrolledStudent.email,
//                                     "Congratulations from CodeHelp",
//                                     "Congratulations, you are onboarded into new CodeHelp Course",
//             );

//             console.log(emailResponse);
//             return res.status(200).json({
//                 success:true,
//                 message:"Signature Verified and COurse Added",
//             });
       
//         }       
//         catch(error) 
//            {
//                 console.log(error);
//                 return res.status(500).json({
//                     success:false,
//                     message:error.message,
//                 });
//             }
//     }
//     else{
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request',
//         });
//     }


}



exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature) {
            //enroll karwao student ko
            console.log("ab student ko enroll krwa rhe hai->");
            await enrollStudents(courses, userId, res);
            //return res
            return res.status(200).json({success:true, message:"Payment Verified"});
        }
        return res.status(200).json({success:"false", message:"Payment Failed"});

}


const enrollStudents = async(courses, userId, res) => {

    if(!courses || !userId) {
        return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
    }

    for(const courseId of courses) {
        try{
            //find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
            {_id:courseId},
            {$push:{studentsEnrolled:userId}},
            {new:true},
        )

        if(!enrolledCourse) {
            return res.status(500).json({success:false,message:"Course not Found"});
        }

        //find the student and add the course to their list of enrolledCOurses
        const enrolledStudent = await User.findByIdAndUpdate(userId,
            {$push:{
                courses: courseId,
            }},{new:true})
            
        ///bachhe ko mail send kardo
        const emailResponse = await mailSender(
            enrolledStudent.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
        )    
        console.log(" course enrollment ka Email Sent Successfully");
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }

}

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
             paymentSuccessEmail(`${enrolledStudent.firstName}`,
             amount/100,orderId, paymentId)
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}
