import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import IconBtn from "../../../common/IconBtn"
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleBuyCourse =() => {
    if(token) {
       const courses = cart.map((course) => course._id)
        buyCourse(token, courses, user, navigate, dispatch);
        return;
    }
       //jab token available na ho
    setConfirmationModal({
        text1:"you are not Logged in",
        text2:"Please login to purchase the course",
        btn1Text:"Login",
        btn2Text:"Cancel",
        btn1Handler:() => navigate("/login"),
        btn2Handler:()=>setConfirmationModal(null),
    })

    if (paymentLoading) {
        // console.log("payment loading")
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
}

}

const {paymentLoading} = useSelector((state)=> state.course);
const [confirmationModal, setConfirmationModal] = useState(null);


  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  )
}