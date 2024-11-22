import { useState, useRef } from 'react';
import React from 'react';

const Reviews = () => {
    const [review, setReview] = useState('')
    const [reviews, setReviews] = useState([])

const addReview = () => {
    setReviews([...reviews,review])
    setReview('')
}
const deleteReview = (deleted) => {
    const withoutRemoved = reviews.filter((item) => item !== deleted)
    setReviews(withoutRemoved)
}



return (
<div className="Reviews">
Reviews

<div className="reviews">
<form>
<input
placeholder='Add new review'
value={review}
onChange={e => setReview(e.target.value)}
onKeyDown={e =>{
    if (e.key === 'Enter') {
        e.preventDefault()
        addReview()
    }
}}
/>
</form>
<ul>
{
reviews.map(item => (
    <li>{item}
    <button classname='delete-button' onClick={() => deleteReview(item)}>Delete</button>
    </li>
))
}
</ul>

</div>
</div>
)
}





export default Reviews;