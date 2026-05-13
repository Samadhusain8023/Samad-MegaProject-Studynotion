import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        // in this last function is an call back functiom first in course the object come and object.tag match with the value and if it is matched then it is stored in result array.
        // .filter(...) is an array method in JavaScript. It loops over each item in the array and keeps only those that return true from the callback function.
      //  sirf samjhne k liye
        // [
        //   { tag: "Free", courses: [...] },
        //   { tag: "Most popular", courses: [...] },
        //   ...
        // ]
   
        // result me ye store rghega
        // [
        //   { tag: "Most popular", courses: [...] }
        // ]
           
       
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }


  return (
    <div>
      {/* Explore more section */}
      <div>
        <div className="text-4xl font-semibold text-center my-10">
          Unlock the
          <HighlightText text={"Power of Code"} />
          <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
            Learn to Build Anything You Can Imagine
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {tabsName.map((ele, index) => {
          return (
            <div
              className={` text-[16px] flex flex-row items-center gap-2 ${
                currentTab === ele
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
              key={index}
              onClick={() => setMyCards(ele)}
            >
              {ele}
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block lg:h-[200px]">
      </div>

      {/* Cards Group */}
      <div className="w-full flex flex-wrap justify-center gap-10   lg:justify-between lg:gap-0 lg:absolute lg:bottom-0 lg:left-1/2 
          lg:translate-x-[-50%] lg:translate-y-[50%] text-black   mb-7 lg:mb-0 px-3 lg:px-0"     >
         
          {courses.map((ele, index) => (
          <CourseCard
            key={index}
            cardData={ele}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
          />
        ))}
      </div>



    </div>
  )
}

export default ExploreMore
