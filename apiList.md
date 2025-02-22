# DevTinder APIs

## authRoutes
- POST /signup
- POST /login
- POST /logout

## profileRoutes
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRoute
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepeted/:requestId
- POST /request/review/rejected/:requestId

## user routes
- GET /user/connections
- GET /user/requests
- GET /user/feed