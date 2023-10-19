export enum ServerEventType {
  CLOSE = 'CLOSE',
  START = 'START',
  BEFORE_START = 'BEFORE_START',
  AFTER_START = 'AFTER_START'
}

export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502
};

export enum ErrorDescription {
  INVALID_INPUT = 'Input provided is not valid.',
  INVALID_PAYLOAD = 'Payload provided does not satisfy our request body requirements.',
  MAINTENANCE = 'Server module under maintenance',
  FORBIDDEN = 'User does not have the permission to access or create resource',
  QUERY_EXCEPTION = 'Malformed query founds in database operations.',
  UNEXPECTED_ERROR = 'An unexpected events occurs on database transactions or server operations. ',
  UNHANDLED_EXCEPTION = 'Errors generate from operations without exception handling.',
  CLIENT_EXCEPTION = 'Client made an invalid request.',
  SERVER_EXCEPTION = 'Server failed to fulfill a request. ',
  UNAUTHORIZED = 'You have no permission access to the resources',
  UNAUTHENTICATED = 'Unable to authenticated with the provided credentials',
  API_KEY_INVALID = 'API Key invalid',
  NOT_FOUND = 'Record not found',
  BAD_GATEWAY = 'Unknown error occurs',
  INVALID_TOKEN_FORMAT = 'The token provided in your request is not in the expected format.',
  IMPLEMENTATION_EXCEPTION = 'It appears that there is an issue with the implementation of a specific feature in the software',
  UNIMPLEMENTED_EXCEPTION = 'It appears that the feature you\'re attempting to access is not yet implemented in the software',
  CONFIG_EXCEPTION = 'It seems that there is an issue with the configuration settings of the software',
  INVALID_ARGUMENT = 'It seems that there is an issue with the argument of the function call',
  CACHE_EXCEPTION = 'It seems that there is an issue with the cache implementation of the function call',
  INVALID_CREDENTIAL = 'The credential provided in your request is not valid.'
}
export enum ErrorCode {
  CACHE_EXCEPTION = 'CACHE_EXCEPTION',
  /**
    * @description
    * The error code "INVALID_TOKEN_FORMAT" typically indicates that the token provided in the request is not in the expected format. Tokens are commonly used for authentication or authorization purposes in web or API interactions.
    */
  INVALID_TOKEN_FORMAT = 'INVALID_TOKEN_FORMAT',
  /**
    * @description
    * The error code "INVALID_CREDENTIAL" typically indicates that the credential provided in the request is not in the expected format. CREDENTIAL are commonly used for authentication or authorization purposes in web or API interactions.
    */
  INVALID_CREDENTIAL = 'INVALID_CREDENTIAL',
  /**
      * @description
     *INVALID_INPUT error code indicates that the input provided is invalid or does not meet the required criteria. It signifies that the input data provided by the user is not acceptable or does not adhere to the expected format or constraints.
      */
  INVALID_INPUT = 'INVALID_INPUT',
  /**
      * @description
      * INVALID_PAYLOAD error code is used when the payload or data sent in a request is invalid or malformed. It suggests that the data structure or content of the payload is not correct or does not conform to the expected format or specifications.
      */
  INVALID_PAYLOAD = 'INVALID_PAYLOAD',
  /**
      * @description
      * MAINTENANCE error code indicates that the system or service is currently undergoing maintenance or is temporarily unavailable. It is used to inform users that the system is offline for scheduled maintenance activities or updates.

      */
  MAINTENANCE = 'MAINTENANCE',
  /**
      * @description
      * FORBIDDEN error code is used to denote that the requested operation or resource is forbidden or not permitted. It suggests that the user does not have the necessary permissions or authorization to access the requested resource.

      */
  FORBIDDEN = 'FORBIDDEN',
  /**
      * @description
      * QUERY_EXCEPTION error code is specific to query-related errors, often associated with database or data retrieval operations. It indicates that there was an issue or exception encountered while executing a query or retrieving data from the database.
      */
  QUERY_EXCEPTION = 'QUERY_EXCEPTION',
  /**
      * @description
      * UNEXPECTED_ERROR error code is used to represent an unexpected or unknown error that occurred during the execution of a process or operation. It signifies that an error occurred that was not anticipated or handled by the system.
      */
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  /**
      * @description
      * UNHANDLED_EXCEPTION error code suggests that an unhandled exception occurred during the execution of code or a process. It means that an unexpected error condition was encountered, and there was no specific error handling mechanism in place to deal with it
      */
  UNHANDLED_EXCEPTION = 'UNHANDLED_EXCEPTION',
  /**
      * @description
      * IMPLEMENTATION_EXCEPTION means that there is an error or
      * problem with how a particular functionality was
      * implemented in our system. This could lead to
      *  unexpected behavior or the feature not
      * functioning as intended. Our development team
      * is actively investigating and addressing
      * the implementation issue to resolve it promptly.
      * We understand the importance of having the
      * software work seamlessly and are committed
      * to providing you with a reliable solution.
      * We appreciate your patience and
      * understanding as we work to fix the problem.
      * Our team is dedicated to delivering a high-quality product,
      * and we apologize for any disruption this may have
      * caused to your experience. If you have any further
      * questions or need assistance with other aspects of
      * our software, please don't hesitate to
      * contact our support team. We are here to
      * help and ensure that you have a smooth
      * and satisfactory experience.
      */
  IMPLEMENTATION_EXCEPTION = 'IMPLEMENTATION_EXCEPTION',
  /**
      * @description
      * UNIMPLEMENTED_EXCEPTION error code indicates that the requested feature or functionality is not yet implemented in the system. It signifies that the specific operation or functionality is currently unavailable or has not been fully developed.
      */
  UNIMPLEMENTED_EXCEPTION = 'UNIMPLEMENTED_EXCEPTION',
  /**
      * @description
      *  This error code represents an exception or error that occurred on the client-side. It suggests that there was an issue or problem with the client application or the way the client interacted with the system.
      */
  CLIENT_EXCEPTION = 'CLIENT_EXCEPTION',
  /**
      * @description
      * This error code is used to indicate an exception or error that occurred on the server-side. It suggests that there was a problem or issue within the server or backend system that prevented the successful processing of the request.
      */
  SERVER_EXCEPTION = 'SERVER_EXCEPTION',
  /**
      * @description
      * This error code signifies that the user or client making the request lacks the necessary authorization or permissions to access the requested resource. It suggests that the user needs to authenticate or obtain appropriate permissions to proceed.
      */
  UNAUTHORIZED = 'UNAUTHORIZED',
  /**
      * @description
      *  UNAUTHENTICATED error code indicates that the user or client making the request is not properly authenticated. It suggests that the user needs to provide valid credentials or authenticate themselves before accessing the requested resource.
      */
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  /**
      * @description
      * API_KEY_INVALID error code is specific to API requests and indicates that the provided API key is invalid or unauthorized. It suggests that the API key used for authentication or authorization is not valid or has been revoked.
      */
  API_KEY_INVALID = 'API_KEY_INVALID',
  /**
      * @description
      * NOT_FOUND error code signifies that the requested resource or endpoint was not found or does not exist in the system. It suggests that the requested URL or resource path does not match any valid endpoints or resources.
      */
  NOT_FOUND = 'NOT_FOUND',
  /**
      * @description
      * BAD_GATEWAY error code indicates a problem or error in the communication between different servers or systems. It suggests that there was an issue with the gateway or intermediary server that prevented the successful completion of the request.
      */
  BAD_GATEWAY = 'BAD_GATEWAY',
  /**
    * @description
    *  CONFIG_EXCEPTION is an error code typically used to represent an exception or error related to the configuration settings or properties of a system or application. It indicates that there is an issue with the configuration setup, which is preventing the system from functioning correctly.
    *
    */
  CONFIG_EXCEPTION = 'CONFIG_EXCEPTION',
  /**
    * @description
    *  INVALID_ARGUMENT is an error code typically used to represent an exception or error related to the function argument or properties of a object or application. It indicates that there is an issue with the function argument, which is preventing the system from functioning correctly.
    *
    */
  INVALID_ARGUMENT = 'INVALID_ARGUMENT'
}

export enum VerifyTokenStatus {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  ACCESS_TOKEN_NOTFOUND = 'ACCESS_TOKEN_NOTFOUND',
  SIGNATURE_VERIFICATION_FAILURE = 'SIGNATURE_VERIFICATION_FAILURE',
  SUCCESS = 'SUCCESS'
};

export enum WebSocketCloseCode {
  CLOSE_NORMAL = 1000, // No No Successful operation / regular socket shutdown
  CLOSE_GOING_AWAY = 1001, // No No Client is leaving (browser tab closing)
  CLOSE_PROTOCOL_ERROR = 1002, // Yes No Endpoint received a malformed frame
  CLOSE_UNSUPPORTED = 1003, // Yes  No Endpoint received an unsupported frame (e.g. binary-only endpoint received text frame)
  // 1004  // Yes No Reserved
  CLOSED_NO_STATUS = 1005, // Yes No Expected close status, received none
  CLOSE_ABNORMAL = 1006, // Yes No No close code frame has been received
  UNSUPPORTED_PAYLOAD = 1007, // Unsupported payload // Yes No Endpoint received inconsistent message (e.g. malformed UTF-8)
  // 1008 Policy violation // No No Generic code used for situations other than 1003 and 1009
  // 1009 CLOSE_TOO_LARGE // No No Endpoint won't process large frame
  // 1010 Mandatory extension // No No Client wanted an extension which server did not negotiate
  SERVICE_RESTART = 1012, // Service restart // No No Server/service is restarting
  // 1013 Try again later // No No Temporary server condition forced blocking client's request
  // 1014 Bad gateway // No No Server acting as gateway received an invalid response
  // 1015 TLS handshake  //fail Yes No Transport Layer Security handshake failure
  // 1016 - 1999 // Yes No Reserved for later
  // 2000 - 2999 // Yes Yes Reserved for websocket extensions
  // 3000 - 3999  // No Yes Registered first come first serve at IANA
  // 4000 - 4999  // No Yes Available for applications
}
