# HustleHub+

HustleHub+ is a secure web-based platform designed to connect clients
with service providers offering their skills and services.

The project is being developed as a full-stack application. Part 1
establishes the secure backend foundation required for the rest of the
platform. This foundation includes user registration, authentication,
authorisation, input validation, password security, JWT-based
authentication, HTTPS communication, rate limiting, security headers,
controlled error handling and automated testing.

The current implementation represents the **Part 1 backend foundation**
of HustleHub+.

------------------------------------------------------------------------

## 1. System Overview

### Purpose

HustleHub+ is intended to provide a structured platform where clients
can access services offered by service providers. The system is designed
around authenticated users and will use role-based access control to
restrict functionality according to the user's role.

The Part 1 implementation focuses on building a secure and maintainable
backend rather than implementing the complete service marketplace.

### Intended Users

The planned system supports the following user roles:

-   **Clients** --- users who will be able to find and interact with
    service providers.
-   **Service providers** --- users who will offer skills and services
    through the platform.
-   **Administrators** --- users who will have elevated permissions for
    managing and overseeing the system.

During Part 1, newly registered users are assigned the `client` role.
The role-based authorisation middleware provides the foundation for
restricting future endpoints to specific roles.

### Current Part 1 Functionality

The backend currently provides:

-   User registration
-   User login
-   Secure password hashing using bcrypt
-   JWT-based authentication
-   Protected API endpoints
-   Role-based authorisation middleware
-   Request validation
-   Authentication-specific rate limiting
-   General API rate limiting
-   Security headers using Helmet
-   CORS configuration
-   HTTPS/TLS communication
-   Environment-based configuration
-   Controlled error responses
-   Automated authentication testing
-   Postman API testing

------------------------------------------------------------------------

# 2. Technology Stack

## Backend

-   Node.js
-   Express.js
-   JavaScript
-   CommonJS modules

## Security

-   `bcryptjs` --- password hashing
-   `jsonwebtoken` --- JWT creation and verification
-   `helmet` --- HTTP security headers
-   `express-rate-limit` --- request rate limiting
-   `express-validator` --- input validation
-   HTTPS/TLS --- encrypted communication
-   OpenSSL --- local development certificate generation

## Testing

-   Jest
-   Supertest

## Development Tools

-   Visual Studio Code
-   Nodemon
-   Postman
-   Git Bash
-   OpenSSL

------------------------------------------------------------------------

# 3. System Architecture

HustleHub+ follows a layered backend architecture. Responsibilities are
separated between the Express application, routes, validation
middleware, controllers, models and supporting security middleware.

The architecture is designed to keep security and application
responsibilities separated and reusable.

## High-Level Architecture

``` text
                         Client / Postman
                               |
                               | HTTPS
                               v
                    +----------------------+
                    |    Express Server    |
                    |       app.js         |
                    +----------------------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
         Helmet / CORS   Rate Limiting    API Routes
                                               |
                                               v
                                    Validation Middleware
                                               |
                                               v
                                         Controllers
                                               |
                                               v
                                           Models
                                               |
                                               v
                                       User Storage
                                        (users.json)

                         Protected Requests
                               |
                               v
                       JWT Authentication
                               |
                               v
                       Role Authorisation
```

## Component Responsibilities

### `server.js`

The entry point for the HTTPS server.

It:

-   Loads environment variables.
-   Loads the local SSL/TLS certificate and private key.
-   Creates the HTTPS server.
-   Starts the server on the configured port.

### `src/app.js`

Configures the Express application.

It is responsible for:

-   Helmet security headers
-   CORS
-   JSON request parsing
-   General rate limiting
-   API route registration
-   Health checks
-   404 handling
-   Global error handling

### `src/routes/`

Defines API endpoints and determines which middleware and controller
should process each request.

### `src/controllers/`

Contains application logic for authentication operations such as:

-   Registration
-   Login
-   Retrieving the current user

### `src/models/`

Handles user data storage and retrieval.

The Part 1 prototype uses a JSON file for storage, which is permitted at
this stage of the assessment. A database can be introduced during later
development.

### `src/validators/`

Contains request validation rules using `express-validator`.

### `src/middleware/`

Contains reusable middleware for:

-   JWT authentication
-   Role-based authorisation
-   Validation error handling

### `src/config/`

Contains environment and application configuration.

### `tests/`

Contains automated Jest/Supertest tests for the authentication API.

------------------------------------------------------------------------

# 4. Backend Folder Structure

``` text
hustleHubProto/
│
├── certificates/
│   ├── server.crt
│   └── server.key
│
├── data/
│   └── users.json
│
├── docs/
│
├── postman/
│
├── src/
│   ├── config/
│   │   └── env.js
│   │
│   ├── controllers/
│   │   └── authController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   └── authRoutes.js
│   │
│   ├── validators/
│   │   └── authValidators.js
│   │
│   └── app.js
│
├── tests/
│   ├── auth.test.js
│   └── setup.js
│
├── .env
├── .env.example
├── .gitignore
├── nodemon.json
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

------------------------------------------------------------------------

# 5. Request Flow

The backend processes requests through a controlled sequence of
middleware and application layers.

## Registration Request Flow

``` text
POST /api/auth/register
          |
          v
     Rate Limiter
          |
          v
   Input Validation
          |
          v
 Validation Error Check
          |
          v
 Authentication Controller
          |
          v
 Check Existing User
          |
          v
    bcrypt Hash
          |
          v
     Create User
          |
          v
     JSON Storage
          |
          v
   Safe User Response
```

The password is hashed before the user is stored, and the password or
password hash is never returned to the client.

## Login Request Flow

``` text
POST /api/auth/login
          |
          v
     Rate Limiter
          |
          v
   Input Validation
          |
          v
 Validation Error Check
          |
          v
 Authentication Controller
          |
          v
 Find User By Email
          |
          v
 bcrypt Password Comparison
          |
          v
       JWT Sign
          |
          v
 Return Token + User
```

## Protected Request Flow

``` text
GET /api/auth/me
          |
          v
 Read Authorization Header
          |
          v
 Extract Bearer Token
          |
          v
      jwt.verify()
          |
       +--+--+
       |     |
    Invalid  Valid
       |     |
       v     v
     401   req.user
             |
             v
        Controller
             |
             v
       User Lookup
             |
             v
       Safe Response
```

This flow ensures that protected resources cannot be accessed without a
valid authentication token.

------------------------------------------------------------------------

# 6. Authentication

HustleHub+ uses JWT-based authentication.

The authentication system consists of registration, login and protected
API access.

## Registration

The registration endpoint is:

``` http
POST /api/auth/register
```

Example request:

``` json
{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "password": "SecurePass123!"
}
```

A successful registration returns a safe user representation:

``` json
{
    "success": true,
    "message": "Account created successfully.",
    "user": {
        "id": "user-id",
        "name": "John Smith",
        "email": "john.smith@example.com",
        "role": "client"
    }
}
```

The password is deliberately excluded from the response.

Duplicate email addresses are rejected with a `409 Conflict` response.

## Login

The login endpoint is:

``` http
POST /api/auth/login
```

Example request:

``` json
{
    "email": "john.smith@example.com",
    "password": "SecurePass123!"
}
```

A successful login returns a JWT:

``` json
{
    "success": true,
    "message": "Login successful.",
    "token": "JWT_TOKEN",
    "user": {
        "id": "user-id",
        "name": "John Smith",
        "email": "john.smith@example.com",
        "role": "client"
    }
}
```

Incorrect credentials return a generic authentication error rather than
revealing whether the email address or password was incorrect.

This reduces unnecessary information disclosure.

------------------------------------------------------------------------

# 7. JWT Token Usage

After a successful login, the client receives a signed JSON Web Token.

The token is used on protected requests through the HTTP `Authorization`
header:

``` http
Authorization: Bearer <JWT>
```

The JWT payload contains:

-   `sub` --- the authenticated user's ID
-   `email` --- the user's email address
-   `role` --- the user's current role

Example payload:

``` json
{
    "sub": "user-id",
    "email": "john.smith@example.com",
    "role": "client"
}
```

The token is signed using a secret stored in the environment rather than
being hard-coded into the source code.

The token lifetime is configurable using:

``` text
JWT_EXPIRES_IN
```

The application defaults to:

``` text
1h
```

if a value is not supplied.

## Token Validation

Every protected request is processed by the authentication middleware.

The middleware:

1.  Checks that the `Authorization` header exists.
2.  Checks that it uses the `Bearer` format.
3.  Extracts the token.
4.  Verifies the token signature.
5.  Detects expired tokens.
6.  Rejects invalid tokens.
7.  Attaches the decoded token to `req.user` when valid.

Invalid or expired tokens are rejected with an HTTP `401 Unauthorized`
response.

------------------------------------------------------------------------

# 8. Password Security

Passwords are securely stored using `bcryptjs`.

The application never stores a user's plain-text password.

The registration process is:

``` text
Plain-text password
        |
        v
   bcrypt.hash()
        |
        v
   Password hash
        |
        v
      Storage
```

The current implementation uses a bcrypt cost factor of `12`.

During login, the supplied password is compared with the stored hash
using:

``` javascript
bcrypt.compare(password, user.passwordHash)
```

This allows the application to verify a password without storing the
original password.

The password hash is also excluded from API responses.

## Why bcrypt is used

Password hashing is necessary because storing plain-text passwords would
expose users if the storage were compromised.

bcrypt is designed specifically for password hashing and includes a
computational cost that makes large-scale password guessing more
difficult.

------------------------------------------------------------------------

# 9. Input Validation

All authentication input is validated before it reaches the controller
logic.

Validation is implemented using `express-validator`.

## Registration Validation

The registration endpoint validates:

### Name

-   Required
-   Between 2 and 50 characters
-   Restricted to appropriate alphabetic characters, spaces, apostrophes
    and hyphens

### Email

-   Required
-   Must be a valid email address
-   Normalised before processing
-   Limited to 254 characters

### Password

The password:

-   Must be a string
-   Must be between 8 and 128 characters
-   Must contain an uppercase letter
-   Must contain a lowercase letter
-   Must contain a number
-   Must contain a special character

## Login Validation

Login validates:

-   Email format
-   Password presence

Invalid requests return:

``` http
400 Bad Request
```

with a structured validation response.

Example:

``` json
{
    "success": false,
    "message": "Validation failed.",
    "errors": [
        {
            "field": "email",
            "message": "Please provide a valid email address."
        }
    ]
}
```

## Why Input Validation is Used

Input validation prevents malformed or unexpected data from reaching
application logic.

It also provides predictable API behaviour and reduces the risk
associated with accepting untrusted input directly.

Validation is performed before controller processing so invalid requests
can be rejected early.

------------------------------------------------------------------------

# 10. HTTPS and TLS

The application is served over HTTPS using a locally generated SSL/TLS
certificate.

The HTTPS server is created in:

``` text
server.js
```

The local certificate files are stored in:

``` text
certificates/
├── server.crt
└── server.key
```

The development server runs on:

``` text
https://localhost:5000
```

## Why HTTPS is Important

Authentication involves sensitive information, including passwords and
authentication tokens.

Without HTTPS, information transmitted between the client and server
could potentially be observed or modified by an attacker on the network.

HTTPS provides encryption for data transmitted between the client and
backend.

It also protects authentication credentials and JWTs while they are
being transmitted.

The certificate used in this project is intended for local development
and assessment purposes.

------------------------------------------------------------------------

# 11. Security Controls

## Helmet

Helmet is enabled globally:

``` javascript
app.use(helmet());
```

Helmet adds security-related HTTP response headers.

This provides a baseline defence against several common web security
risks and improves the security posture of the Express application.

## Rate Limiting

Two levels of rate limiting are implemented.

### General API Rate Limiting

The general API limiter allows:

``` text
100 requests per 15 minutes
```

This helps prevent excessive requests against the application.

### Authentication Rate Limiting

Registration and login use a stricter limiter:

``` text
10 requests per 15 minutes
```

Authentication endpoints are particularly sensitive to repeated requests
because attackers may attempt credential guessing or automated account
creation.

The stricter limit therefore provides an additional layer of protection.

## CORS

CORS is configured so that the backend can communicate with the frontend
while supporting credentials for authenticated frontend communication.

## JWT Authentication

JWT verification ensures that protected API requests originate from a
client possessing a valid signed authentication token.

## Role-Based Authorisation

The `requireRole()` middleware provides reusable access control.

For example:

``` javascript
requireRole("admin")
```

can restrict an endpoint to administrators.

Multiple roles can also be provided:

``` javascript
requireRole("client", "provider")
```

If an authenticated user does not have an allowed role, the server
returns:

``` http
403 Forbidden
```

with:

``` json
{
    "success": false,
    "message": "You do not have permission to access this resource."
}
```

This separates authentication from authorisation:

-   **Authentication:** Who is the user?
-   **Authorisation:** Is the user allowed to perform this action?

------------------------------------------------------------------------

# 12. Environment Variables and Secrets

Sensitive configuration is stored in `.env`.

The application currently requires:

``` text
JWT_SECRET
```

The JWT expiration period and HTTPS port can also be configured:

``` text
JWT_EXPIRES_IN=1h
HTTPS_PORT=5000
```

Example configuration is provided through:

``` text
.env.example
```

The actual `.env` file is excluded from source control.

## Why Environment Variables Are Used

Secrets should not be embedded directly in source code.

Using environment variables makes it possible to use different
configuration values between development, testing and deployment
environments without modifying application code.

The application also checks for required environment variables during
startup. If `JWT_SECRET` is missing, startup fails rather than allowing
the application to operate with an undefined signing secret.

------------------------------------------------------------------------

# 13. Error Handling

The API uses controlled and consistent error responses.

A global Express error handler prevents unhandled application errors
from exposing internal implementation details to clients.

Unexpected server errors return:

``` json
{
    "success": false,
    "message": "An internal server error occurred."
}
```

Detailed errors are logged server-side for development and debugging.

The API also provides controlled responses for:

-   Invalid input
-   Missing required fields
-   Duplicate accounts
-   Invalid credentials
-   Missing authentication tokens
-   Invalid JWTs
-   Expired JWTs
-   Malformed authentication headers
-   Unauthorised roles
-   Unknown routes

## Information Disclosure

The application deliberately avoids returning:

-   Stack traces
-   File system paths
-   JWT secrets
-   Passwords
-   Password hashes
-   Internal configuration values

This reduces the amount of information available to an attacker through
API responses.

------------------------------------------------------------------------

# 14. API Endpoints

## Health Check

``` http
GET /api/health
```

Purpose:

Confirms that the API is running.

Authentication:

``` text
Not required
```

Example response:

``` json
{
    "success": true,
    "message": "HustleHub+ API is running"
}
```

## Register

``` http
POST /api/auth/register
```

Purpose:

Creates a new client account.

Authentication:

``` text
Not required
```

## Login

``` http
POST /api/auth/login
```

Purpose:

Authenticates a user and returns a JWT.

Authentication:

``` text
Not required
```

## Current User

``` http
GET /api/auth/me
```

Purpose:

Returns information about the currently authenticated user.

Authentication:

``` text
Required
```

Required header:

``` http
Authorization: Bearer <JWT>
```

------------------------------------------------------------------------

# 15. Data Storage

For Part 1, user data is stored locally in:

``` text
data/users.json
```

The user model provides functions for:

-   Finding a user by email
-   Finding a user by ID
-   Creating a user
-   Reading stored users
-   Writing updated user data

The JSON file is used because the assessment permits local in-memory or
file-based storage during this stage.

The model layer has been kept separate from the controllers so that the
storage mechanism can be replaced with a database later without
requiring the entire authentication system to be rewritten.

A database-backed implementation can therefore be introduced during
later development.

------------------------------------------------------------------------

# 16. Automated Testing

The authentication API is tested using Jest and Supertest.

The current test suite contains **15 automated tests**.

The tests cover:

1.  Successful user registration
2.  Duplicate email rejection
3.  Weak password rejection
4.  Successful login
5.  Incorrect password rejection
6.  Missing authentication token
7.  Invalid JWT
8.  Valid JWT
9.  JWT payload contents
10. bcrypt password hashing
11. Missing required registration fields
12. Invalid email validation
13. Malformed authorization header
14. Expired JWT
15. Empty Bearer token

The tests verify both successful operations and expected failure cases.

## Current Test Result

The current test suite passes:

``` text
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

Tests can be executed with:

``` bash
npm test
```

------------------------------------------------------------------------

# 17. Postman API Testing

The API can be tested manually using Postman.

The authentication API can be tested using the following workflow:

``` text
1. Check API health
       |
       v
2. Register a user
       |
       v
3. Login with the registered account
       |
       v
4. Copy the returned JWT
       |
       v
5. Send JWT to /api/auth/me
       |
       v
6. Verify authenticated response
```

Invalid scenarios can also be tested, including:

-   Duplicate registration
-   Invalid email
-   Weak password
-   Incorrect password
-   Missing token
-   Invalid token
-   Invalid authorisation header
-   Expired token

The project contains a `postman` directory for the API testing
resources.

------------------------------------------------------------------------

# 18. Running the Project

## Prerequisites

The following tools are required:

-   Node.js
-   npm
-   Git Bash/OpenSSL for local certificate generation
-   Postman for manual API testing

## Install Dependencies

From the project root:

``` bash
npm install
```

## Environment Configuration

Create a `.env` file based on `.env.example`.

Example:

``` text
JWT_SECRET=your-development-secret
JWT_EXPIRES_IN=1h
HTTPS_PORT=5000
```

The JWT secret should be replaced with a strong development secret.

The `.env` file must not be committed to source control.

## Start Development Server

``` bash
npm run dev
```

The server runs at:

``` text
https://localhost:5000
```

## Start Normally

``` bash
npm start
```

## Run Tests

``` bash
npm test
```

------------------------------------------------------------------------

# 19. Security Design Rationale

Security decisions were considered as part of the application
architecture.

## bcrypt Password Hashing

Passwords are hashed rather than stored as plain text because a
compromised user data store should not immediately reveal users'
passwords.

A bcrypt cost factor of 12 is used to provide computationally expensive
password hashing.

## JWT Authentication

JWTs provide a stateless authentication mechanism suitable for an API.

After login, the client can present the signed token on subsequent
protected requests.

The server verifies the signature before trusting the identity and role
contained in the token.

## Environment-Based JWT Secret

The JWT signing secret is stored in an environment variable instead of
source code.

This prevents the secret from becoming part of the application's source
and allows different environments to use different secrets.

## HTTPS

HTTPS encrypts communication between clients and the backend.

This is especially important because registration and login involve
passwords and authentication tokens.

## Input Validation

Validation prevents malformed and unexpected input from reaching
application logic.

It also gives clients predictable error responses.

## Rate Limiting

Rate limiting reduces the ability of automated clients to make large
numbers of requests.

A stricter limit is applied to authentication endpoints because login
and registration are higher-risk targets for automated abuse.

## Helmet

Helmet provides security-related HTTP headers that strengthen the
Express application's baseline security configuration.

## Role-Based Authorisation

Authentication alone does not determine whether a user should be allowed
to perform an action.

Role-based authorisation provides a second layer of access control by
checking the authenticated user's role before allowing protected
functionality.

## Controlled Error Responses

Error responses are intentionally kept generic where appropriate.

This prevents implementation details such as stack traces, file paths
and configuration values from being disclosed to API clients.

------------------------------------------------------------------------

# 20. Maintainability and Separation of Concerns

The backend is divided into separate layers so that each part has a
clear responsibility.

For example:

``` text
Routes
  |
  v
Validation Middleware
  |
  v
Authentication / Authorisation Middleware
  |
  v
Controller
  |
  v
Model
  |
  v
Storage
```

This structure makes the application easier to maintain and extend.

For example, changing the storage mechanism from `users.json` to MongoDB
in a later stage can be handled primarily within the model/data-access
layer instead of requiring authentication routes and controllers to be
completely redesigned.

Similarly, validation and authentication are implemented as reusable
middleware rather than being duplicated inside every controller.

------------------------------------------------------------------------

# 21. Part 1 Completion Status

The Part 1 secure backend foundation currently includes:

-   [x] Node.js and Express backend
-   [x] Layered backend architecture
-   [x] User registration
-   [x] User login
-   [x] bcrypt password hashing
-   [x] JWT authentication
-   [x] Protected API endpoint
-   [x] JWT validation
-   [x] Role-based authorisation middleware
-   [x] Input validation
-   [x] Controlled validation errors
-   [x] HTTPS/TLS
-   [x] Helmet security headers
-   [x] CORS configuration
-   [x] General rate limiting
-   [x] Authentication rate limiting
-   [x] Environment-based secret configuration
-   [x] Global error handling
-   [x] Automated authentication tests
-   [x] Postman API testing

The secure backend foundation is now ready to be extended with the
platform's core HustleHub+ functionality in subsequent development
stages.

------------------------------------------------------------------------

# 22. Development Project

Current prototype project name:

``` text
HustleHub+ Prototype
```

This prototype is being used to establish and test the application's
functionality and security foundation before the implementation is
transferred into the main submission project.
