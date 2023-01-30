// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  // VALIDATION REGISTER WITH BLANK / EMPTY FIELD
  if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
    customError.statusCode = 400
  }

  // VALIDATION FOR REGISTER WITH THE SAME EMAIL
  if (err.code && err.code === 11000) {
    /*
      WAY TO TAKE OBJECT KEYS
      ${Object.Keys(err.KeyValue)}
    */
    customError.msg = `Duplicate value entered for email ${err.keyValue.email}, please choose another email`;
    customError.statusCode = 400;
  }

  // VALIDATION FOR CAST ERROR / FOR GET ONE DATA / DELETE DATA / UPDATE DATA WITH NO ID MATCHED

  if(err.name === 'CastError'){
    customError.msg = `Id with ${err.value} something you search is not found`
    customError.statusCode = 404;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
