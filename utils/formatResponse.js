const formatResponse = (statusCode, success, message, responseData = null) => {
    return {
      statusCode,
      success,
      message,
      response: responseData,
    };
  };
  
  module.exports = formatResponse;
  