// Example protected route controller
const protectedRoute = (req, res) => {
    // Handle the protected API route logic
    res.json({ message: 'Protected API route' });
  };
  
  module.exports = {
    protectedRoute
  };
  