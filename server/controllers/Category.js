const { Mongoose } = require("mongoose");
const Category = require("../models/Category");


function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}


// createCategory
exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


// get all category handler
exports.showAllCategory = async (req, res) => {
    try{
        const allCategory = await Category.find({}, {name:true, description:true}); 
        res.status(200).json({
            success:true,
            message:"All Category returned successfully",
            data: allCategory,
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};


//categoryPageDetails 
exports.categoryPageDetails = async (req, res) => {
  try {
    // console.log("1");
    const { categoryId } = req.body
    console.log("PRINTING CATEGORY ID: ", categoryId);
    // Get courses for the specified category
    // console.log("2");
    const selectedCategory = await Category.findById(categoryId)
    .populate({
      path: "courses",
      match: { status: "Published" },
      populate: [
        {
          path: "ratingAndReview",
        },
        {
          path: "instructor",
        },
      ],
    })
    .exec();
      // console.log("3");
    //console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }

    
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }

    console.log("5");

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })

        let differentCategory = null;
    if (categoriesExceptSelected.length > 0) {
      const randomIndex = getRandomInt(categoriesExceptSelected.length);
      const randomCategoryId = categoriesExceptSelected[randomIndex]._id;
      differentCategory = await Category.findOne(randomCategoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          {
            path: "ratingAndReview",
          },
          {
            path: "instructor",
          },
        ],
      })
      .exec();
    }

    

      console.log("6");
      //console.log("Different COURSE", differentCategory)


    // Get top-selling courses across all categories
    const allCategories = await Category.find()
    .populate({
      path: "courses",
      match: { status: "Published" },
      populate: [
        {
          path: "ratingAndReview",
        },
        {
          path: "instructor",
        },
      ],
    })
    .exec();

    const allCourses = allCategories.flatMap((category) => category.courses)
    
    const mostSellingCourses = allCourses
    .sort(
          (a, b) =>  b.studentsEnrolled.length - a.studentsEnrolled.length
        )
       .slice(0, 10)
     // console.log("mostSellingCourses COURSE", mostSellingCourses)
    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}