const { json } = require('body-parser')
const Doctor = require('./../models/doctorModel')
exports.getAll = async (req,res,next)=>{
    const queryObj = {...req.query}
    const excludeFields = ['page', 'sort', 'limit' , 'field' ]
    excludeFields.forEach(el=> delete queryObj[el])
 // advanced filtering
 let queryStr = JSON.stringify(queryObj)
 queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`)
    let query = Doctor.find(JSON.parse(queryStr))

    // sorting
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }
    // execute the query
    const doctors = await query
    res.status(200).json({
        results: doctors.length,
        status: 'success',
        doctors
    })
    
}
exports.delete = async(req, res,next)=>{
    const user = await Doctor.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: 'success',
        data: null
      });
    };

exports.getDoctor = async(req, res, next)=>{
    const doctor = await Doctor.findById(req.params.id).populate('Reviews')
    res.status(200).json({
        status: 'success',
        doctor
    })
}   
module.exports 