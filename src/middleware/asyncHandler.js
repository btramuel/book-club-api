//
// Purpose
//   wrapper for async controller functions so I don't
//   have to write try/catch in every single one. If the function
//   throws, it just hands the error off to the error handler
//   in server.js.
//
// Why
//   Every controller had the same try/catch pattern checking
//   err.status and falling back to 500. Got really repetitive.
//

function asyncHandler(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

export default asyncHandler;