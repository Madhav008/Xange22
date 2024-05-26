const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User.js')

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      if(token==null){
        console.error(error)
        res.status(401)    
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findById(decoded.userId).select('-password')
      req.user = user;
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" })
  }
})

const admin = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findById(decoded.userId).select('-password')
      if (user.isAdmin) {
        next()
      } else {
        res.status(401).json({ message: "Not authorized as an admin" })
        throw new Error('Not authorized')
      }
    } catch (error) {
      console.error(error)
      res.status(401).json({ message: "Not authorized" })
      throw new Error('Not authorized, token failed')
    }
  }

})

module.exports = { protect, admin }