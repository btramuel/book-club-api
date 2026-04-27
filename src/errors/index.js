// 
// Purpose
//    Custom error classes that the service layer throws.
//    Each one corresponds to an HTTP status code, so controllers
//    can decide what to send back without checking error message
//    strings (which is brittle — change the message, break the
//    status code).
//
// The classes
//    - ValidationError → 400 Bad Request
//    - AuthError       → 401 Unauthorized
//    - ForbiddenError  → 403 Forbidden
//    - NotFoundError   → 404 Not Found
//    - ConflictError   → 409 Conflict 
//
//    Each controllers class has a static status property. The controller
//    just checks `err.status` and uses it directly.
//

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    this.status = 401;
  }
}

export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.status = 403;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.status = 409;
  }
}
