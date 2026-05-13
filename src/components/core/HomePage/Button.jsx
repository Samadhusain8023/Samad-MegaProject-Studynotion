import React from "react";
import { Link } from "react-router-dom";


function Button(props) {
  return (
    <Link to={props.linkto}>
      <div
        className={`text-center text-[13px] px-6 py-3 rounded-md font-bold transition-all duration-200
          hover:scale-95  ${props.active ? "bg-yellow-50 text-black" : "bg-richblack-800 text-white"}`}
      >
        {props.children}
      </div>
    </Link>
  );
}

export default Button;

