const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// createRatingandReview
exports.createRating = async (req, res) => {
    try {
      const userId = req.user.id;
      const { rating, review, courseId } = req.body;
  
      //  check enrollment
      const courseDetails = await Course.findOne({
        _id: courseId,
        studentsEnrolled: { $elemMatch: { $eq: userId } },
      });
  
      if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: "Student is not enrolled in the course",
        });
      }
  
      //  check already reviewed
      const alreadyReviewed = await RatingAndReview.findOne({
        user: userId,
        course: courseId,
      });
  
      if (alreadyReviewed) {
        return res.status(403).json({
          success: false,
          message: "Course already reviewed",
        });
      }
  
      // create review
      const ratingReview = await RatingAndReview.create({
        rating,
        review,
        course: courseId,
        user: userId,
      });
  
      //  update course
      const updatedCourseDetails = await Course.findByIdAndUpdate(
        courseId,
        {
          $push: {
            ratingAndReview: ratingReview,
          },
        },
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: "Rating and Review created successfully",
        ratingReview,
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };





// Get the average rating for a course
exports.getAverageRating = async (req, res) => {
  // try {
  //   const courseId = req.body.courseId

  //   // Calculate the average rating using the MongoDB aggregation pipeline
  //   const result = await RatingAndReview.aggregate([
  //     {
  //       $match: {
  //         course: new mongoose.Types.ObjectId(courseId), // Convert courseId to ObjectId
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         averageRating: { $avg: "$rating" },
  //       },
  //     },
  //   ])

  //   if (result.length > 0) {
  //     return res.status(200).json({
  //       success: true,
  //       averageRating: result[0].averageRating,
  //     })
  //   }

  //   // If no ratings are found, return 0 as the default rating
  //   return res.status(200).json({ success: true, averageRating: 0 })
  // } catch (error) {
  //   console.error(error)
  //   return res.status(500).json({
  //     success: false,
  //     message: "Failed to retrieve the rating for the course",
  //     error: error.message,
  //   })
  // }
}



// Get all rating and reviews
exports.getAllRating = async (req, res) => {
  try {
    // console.log("apno  sabhi  rating nikalne k liye backend me aa gye  hai->");
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image", // Specify the fields you want to populate from the "Profile" model
      })
      .populate({
        path: "course",
        select: "courseName", //Specify the fields you want to populate from the "Course" model
      })
      .exec()

    //   console.log("apno ne sabhi rating nikal li hai->",allReviews);

    res.status(200).json({
      success: true,
      data: allReviews,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating and review for the course",
      error: error.message,
    })
  }
}
