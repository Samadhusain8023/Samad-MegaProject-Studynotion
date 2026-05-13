import React from 'react'
import logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timelineImage from "../../../assets/Images/TimelineImage.png"

const TimeLine =[
    {
        Logo:logo1,
        heading:"Leadership",
        Description:"Fully committed to the success company"
    },
    {
        Logo:logo2,
        heading:"Leadership",
        Description:"Fully committed to the success company"
    },
    {
        Logo:logo3,
        heading:"Leadership",
        Description:"Fully committed to the success company"
    },
    {
        Logo:logo4,
        heading:"Leadership",
        Description:"Fully committed to the success company"
    },
    
]

const TimeLineSection = () => {
  return (
    <div >
        <div className='flex gap-15 items-center'>
          <div className='w-[45%] flex flex-col gap-5'>
           {
            TimeLine.map((element,index)=>
            (
                <div className='flex gap-6 ' key={index}>
                    <div className='w-[50px] h-[50px] bg-white flex items-center '>
                        <img alt='salmabaji'  src={element.Logo}/>
                    </div> 
                    <div>
                        <p className='font-semibold text-[18px]'>{element.heading}</p>
                        <p >{element.Description}</p>
                    </div>
                </div>
            ))
           }

          </div>

          <div className='shadow-blue-200 relative'>
          <img alt='salman khan' src={timelineImage}
            className='shadow-white h-fit object-cover'
          />

          <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7
                            left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                <div className='flex gap-5 items-center px-7 border-caribbeangreen-300 border-r'>
                <p className='text-3xl font-bold'>10</p>
                <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                </div>

                <div className='flex gap-5 items-center px-7'>
                <p className='text-3xl font-bold'>250</p>
                <p className='text-caribbeangreen-300 text-sm'>TYpe of Courses</p>
                </div>

          </div>


          </div>

        </div>
    </div>
  )
}

export default TimeLineSection