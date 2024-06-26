const doctorReviews = require('../models/doctorReviewsModel')

exports.getAllReviews = async(req, res, next) => {
    const reviews = await doctorReviews.find()
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        reviews: reviews
    })
}
exports.createReview = async(req, res, next) => {
    // allow nested routes 
    // if(!req.body.doctor)  req.body.user = req.params.docId
    // if(!req.body.user)    req.body.user = req.user.id
    const newReview = await doctorReviews.create(req.body)
    res.status(200).json({
        status: 'success',
        newReview: newReview
    })

}
