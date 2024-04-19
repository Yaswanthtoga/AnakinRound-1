# AnakinRound-1
IRCTC API Design

## API Tech Stack & Requirements
1) Nodejs + Typescript for end-to-end backend code developement.
2) PostgreSQL for storage.
3) You must have [Docker](https://docs.docker.com/get-docker/) for deploying or containerized the Database environment.
4) Use any api-endpoint testing tools like Postman, Thunderclient (VS code Extension)

## Project Setup

clone the repo
```bash
git clone https://github.com/Yaswanthtoga/my-api.git irctc
```

Open your favourite terminal where you cloned project should be at the root
For PostgreSQL setup

```bash
cd db
```

#### This command will used to create the respective docker containers.
```
docker-compose build
```
#### This command will be used to start the containers
```
docker-compose up
```

## Open terminal at api folder

####  For installing packages
```
npm install
```

#### Migrate the db schemas to real tables
```
npm run migrate
```

#### Start the server
```
npm start
```

============================================================================================


## API Endpoints Usage

```python
# For Register
# Note : Necessary Validations Added

Post : localhost:8000/api/auth/register

# Example
Request Data Format : 
{
  "name":"Yaswanth",
  "email":"yaswanth@gmail.com",
  "role":"admin"
}

Note : Please add "role" field either "admin" / "user"

```python
# For Login
# Note : Necessary Validations Added

Post : localhost:8000/api/auth/login

# Example
Request Data Format : 
{
  "email":"yaswanth@gmail.com"
}

Response:
{
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Illhc3dhbnRoIiwiZW1haWwiOiJ5YXN3YW50aEBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTM0OTQzODcsImV4cCI6MzQyNjk5MjM3NH0.1tqHJ6lGkJeIiYMVT-BlBEqqNKS3pL1umpEzHjqRRps"
  }
}


# For Adding Train
# Note : Necessary Validations Added

Post : localhost:8000/api/reservation/add-train

# Example
Request Data Format : 
{
  "trainNumber":345738,
  "trainName": "Godavari Express",
  "totalSeats": 500
}
Headers :
Authorization : pass the jwt token
x-admin-apikey : pass the apikey generated when admin registered


# For Scheduling Trains
# Note : Necessary Validations Added

Post : localhost:8000/api/reservation/schedule-train

# Example
Request Data Format : 
{
  "source":"Vizag",
  "destination":"Hyderabad",
  "trainNumber":634647,
  "availableSeats":300
}

Headers :
Authorization : pass the jwt token
x-admin-apikey : pass the apikey generated when admin registered



# For Get Trains
# Note : Necessary Validations Added

Get : localhost:8000/api/reservation/get-trains?source=Vizag&destination=Hyderabad

Note : Add the data through query params

Headers :
Authorization : pass the jwt token


# For Book Seats
# Note : Necessary Validations Added

Post : localhost:8000/api/reservation/book-seat

Example :
Request Format :
{
  "trainNumber":634647,
  "numberOfSeats":2
}

Headers :
Authorization : pass the jwt token



# For Get ticket details
# Note : Necessary Validations Added

Post : localhost:8000/api/reservation/get-ticket-details?PNR=<pass>

Note : Pass the data through query params

Headers :
Authorization : pass the jwt token

















