const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;

  try {
    
    // // Check subSection
    // const subSection = await SubSection.findById(subSectionId);
    // if (!subSection) {
    //   return res.status(404).json({ error: "Invalid subsection" });
    // }

    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    // If not exist → create & return
    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [subSectionId],
      });

      await mongoose.model("User").findByIdAndUpdate(userId, {
        $push: { courseProgress: courseProgress._id },
      });

      return res.status(200).json({
        success: true,
        message: "Course progress created",
      });
    }


    if (courseProgress.completedVideos.includes(subSectionId)) {
      return res.status(400).json({
        error: "Subsection already completed",
      });
    }

    courseProgress.completedVideos.push(subSectionId);

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course progress updated",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};