export default function GetAvgRating(ratingArr) {
  if (ratingArr?.length === 0) return 0
  const totalReviewCount = ratingArr?.reduce((acc, curr) => {
    acc += curr.rating
    return acc
  }, 0)

  const multiplier = Math.pow(10, 1)
  const avgReviewCount =
    Math.round((totalReviewCount / ratingArr?.length) * multiplier) / multiplier

  return avgReviewCount
}


// export default function GetAvgRating(ratingArr) {
//   if (!ratingArr || ratingArr.length === 0) return 0;

//   const total = ratingArr.reduce((acc, curr) => acc + curr.rating, 0);

//   const avg = total / ratingArr.length;

//   return Number(avg.toFixed(1)); 
// }