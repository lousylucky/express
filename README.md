
# 🎬 Movie Rental API

This is a Node.js RESTful API for a fictional movie rental service called **Vidly**, using Express and MongoDB. It supports user registration, authentication, movie rentals, and returns.

##  Project Structure
.

├── index.js  # Main application entry point

├── routes/  # Express route handlers

├── models/  # Mongoose models

├── middleware/  # Express middleware

├── startup/  # App configuration modules

├── config/  # Configuration settings

├── tests/  # Unit and integration tests

├── Dockerfile  # Docker build configuration

├── docker-compose.yml  # Multi-container Docker setup

├── logs/  # Log files (winston)

├── coverage/  # Test coverage reports

---

## Getting Started

###  Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) + Docker Compose
- [MongoDB](https://www.mongodb.com/) (only if not using Docker)

---

### Recommended Setup (with Docker)

1.  Build and start the containers:
```bash
docker-compose up --build
```
2.  The API should now be available at  http://localhost:3000

###  Setup (without Docker)

1. Clone the repository:
```bash
   git clone https://github.com/lousylucky/express.git
   cd express
```
   2.  Install dependencies:
```bash
   npm install
```
 
   3.  Settings are managed with the  config  package. Customize your environment variables using:

-   config/default.json
    
-   config/custom-environment-variables.json

```json
{
	"db": "mongodb://localhost/vindly",
	"jwtPrivateKey": "your_secure_key"
}
```
    
   4.  Start the server:

```bash
   node index.js
   ```
  
 
##  API Features

-   User registration and JWT-based authentication
    
-   Admin-only operations (e.g., deleting genres)
    
-   Movie and genre 
    
-   Customer and rental tracking
    
-   Returns with fee calculations
    
-   Input validation with Joi
 
##  Testing

To run  tests:
```bash
npm test
```
Code coverage is generated using Jest and can be found in the  coverage/  directory.


## Logging

  
Application logs and error logs are saved using Winston:

-   logs/logfile.log
    
-   logs/exceptions.log
    
-   logs/rejections.log
##  Docker Overview


### **Services**

-   backend: Express + MongoDB API
    
-   database: MongoDB 4.0
    
### **Volumes**
volumes:
- vidly:

## API Documentation

IF authorization is required: for all requests in the headers with the key  x-auth-token.
We obtain token when creating new user or by POST /api/auth/

## 🧑‍💼 Users

### `GET /api/users/me`

Returns the current authenticated user (excluding password).

-  **Auth required:** Yes

-  **Response:**

```json
{
	"_id": "string",
	"name": "string",
	"email": "string"
}
```

### **POST /api/users**

  
Registers a new user.

-   **Auth required:** No
    
-   **Request Body:**

```json
{
	"name": "string",
	"email": "string",
	"password": "string"
}
```

-   **Response:**

```json
{
	"name": "string",
	"email": "string"
}
```
- **Auth**:  new token in Headers.x-auth-token

### **PUT /api/users/:id**


Updates an existing user’s name and email.

-   **Auth required**: Yes
    

-   **Request Body:**

```json
{
	"name": "string",
	"email": "string"
}
```
-   **Responses:**
    
    -   200 OK: “Success”
        
    -   400 Bad Request: Validation error
        
    -   404 Not Found: User with given ID does not exist

### **DELETE /api/users/:id**

Deletes a user by ID.

-   **Auth required**: Yes
    
-   **Response:**  Returns the deleted user (excluding password)


## **🔐 Auth**

### **POST /api/auth**

Logs in a user and returns a JWT token. 


-   **Request Body:**
```json
{
	"email": "user@example.com",
	"password": "yourpassword"
}
```

-   **Response:**
    
    -   200 OK  with token
        
    -   400 Bad Request  for invalid credentials or missing field

## **🎭 Genres**

### **GET /api/genres**

Returns all genres, sorted by name.

-   **Response:**  Array of Genre objects
    
-   **Logging:**  Logs user ID (if authenticated), request URL, and IP


### **GET /api/genres/:id**

Returns a specific genre by ID.

-   **Response:**  Genre object or 404

### **POST /api/genres**

Creates a new genre.

-   **Auth required:** Yes
    
-   **Request Body:**

 -  **Name need to be**: 'SF', 'romantic', 'dramat', 'thiller'


```json
{
	"name": "string"
}
```
-   **Response:**  Created  Genre object  or error

### **PUT /api/genres/:id**

Updates a genre by ID.

-   **Auth required:** Yes
        
-   **Request Body:**

```json
{
	"name": "string"
}
```
-   **Response:**  "Success" or 404

### **DELETE /api/genres/:id**

Deletes a genre by ID.

-   **Auth required:** Yes
    
-   **Admin required:** Yes
        
-   **Response:** Deleted Genre object or 404

## 🎥 Movies

### `GET /api/movies`

Returns all movies sorted by title.

-  **Response:** `Array of Movie objects`

---

### `GET /api/movies/:id`

Returns a single movie by ID.

-  **Response:** `Movie object` or `404` if not found

---

### `POST /api/movies`

Creates a new movie.
-   **Auth required:** Yes

-  **Request Body:**

```json
{
	"title": "string",
	"genreId": "string"
}
```

-   **Response:**  Created  Movie object  or validation errors
---

### **PUT /api/movies/:id**

Updates the name of a movie.

-   **Auth required:** Yes

-   **Request Body:**

```json
{
	"title": "string"
}
```
-   **Response:**  "Success" or 404


### **DELETE /api/movies/**

Delete movie by ID.

-   **Auth required:** Yes

-  **Response:** `Movie object` or `404` if not found


## **👥 Customers**

### **GET /api/customers**

-   **Auth required:** Yes

Returns all customers sorted by name.

### **GET /api/customers/:id**

-   **Auth required:** Yes

Returns a customer by ID.

### **POST /api/customers**

-   **Auth required:** Yes

Creates a new customer.

-   **Request Body:**
```json
{
	"name": "string",
	"phone": "number",
	"isGold": boolean
}
```

-  **Response:** `Customer object` or `404` if not found


### **PUT /api/customers/:id**

-   **Auth required:** Yes

Updates a customer name by ID.

-   **Request Body:**
```json
{
	"name": "string",
	"phone": "number",
	"isGold": boolean
}
```

-   **Response:**  "Success" or 404


### **DELETE /api/customers/**

-   **Auth required:** Yes

Delete a customer name by ID.

**Response**:

-   **200 OK**: The deleted customer object.
    
-   **404 Not Found**: If a customer with the provided ID is not found.



## **🎬 Rentals**

### **GET /api/rentals**

-   **Auth required:** Yes

Returns all rental records sorted by most recent.

-   **Response:**  Array of Rent objects

### **GET /api/rentals/:id**

-   **Auth required:** Yes

Returns a specific rental by ID.

-   **Response:**  Rent object or 404

### **POST /api/rentals**

-   **Auth required:** Yes

Creates a new rental.

-   **Request Body:**
```json
{
	"customerId": "string",
	"movieId": "string"
}
```

-   **Response:**  Rent object  or appropriate error message.

### **DELETE /api/rentals/**

-   **Auth required:** Yes

**(Bug: Same as above)**

Attempts to delete a rent by ID (but route lacks  :id).

## **🔁 Returns**


### **POST /api/returns**

Processes the return of a movie rental.

-   **Auth required:** Yes
    
-   **Request Body:**
```json
{
	"customerId": "string",
	"movieId": "string"
}
```

-   **Response:**  Updated  Rent  object or appropriate error message:
    
    -   404 rent not found
        
    -   400 rent already processed



## **👨‍💻 Author**

Created by Lukasz Matyasik 
2025