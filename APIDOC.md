# **Motor Nation** API Documentation
The Motor Nation API provides information about all of the vehicles in the database that we sell as well as users' transaction history. Vehicles and vehicle names are based on vehicles from the GTA V video game.


## *Get a list of vehicles matching filter parameters*
**Request Format:** /vehicles?maxPrice=X&type=Y

**Request Type:** GET

**Returned Data Format:** Plain text

**Description:** Returns a list of all vehicles matching the given type and price filters.

**Example Request:** /vehicles?maxPrice=100000&type=car

**Parameters:**
- `maxPrice`: the maximum price of returned vehicles (i.e. 10000, 20000, ..., 10000000)
- `type`: the type of vehicle returned (i.e. car, boat)

**Example Response:**

```
Asterope
Baller
Blista
Tailgater S
Windsor
...
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - if a filter is missing, an error is returned with the message: `Missing a Filter Parameter`
- Possible 500 errors (all plain text):
  - if something goes wrong on the server or the database, returns an error message: `Something on the server went wrong!`

## *Get a list of vehicles matching search terms*
**Request Format:** /search/vehicles?search=X

**Request Type:** GET

**Returned Data Format:** Plain text

**Description:** Returns a list of all vehicles matching the search term.

**Example Request:** /search/vehicles?search=police

**Parameters:**
- `search`: the search term

**Example Response:**

```
Police
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - if search term is empty, an error is returned with the message: `Please Provide a Search Term.`
- Possible 500 errors (all plain text):
  - if something goes wrong on the server or the database, returns an error message: `Something on the server went wrong!`

## *Get information of a specific vehicle*
**Request Format:** /vehicles/:vehicle_name

**Request Type:** GET

**Returned Data Format:** JSON

**Description:** Returns information of a selected vehicle when user clicks on a vehicle card

**Example Request:** /vehicles/Police

**Parameters:**
- `vehicle_name`: Name of the vehicle

**Example Response:**

```json
{
  "name": "Police",
  "type": "other",
  "price": 50000,
  "in-stock": 30,
  "rating": 3.357142857142857,
  "picture": "img/vehicles/police.png"
}
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - if something goes wrong on the server or the database, returns an error message: `Something on the server went wrong!`

## *Get Reviews of a Vehicle*
**Request Format:** /reviews/all/:vehicle_name

**Request Type:** get

**Returned Data Format:** JSON

**Description:** When a user selects a vehicle, returns the all reviews of said vehicle

**Example Request:** /reviews/all/Police

**Parameters:**
- `vehicle_name`: name of vehicle

**Example Response:**

```json
[
  {
    "user": "OfficerBob",
    "rating": 5,
    "comment": "good, fast, reliable",
    "date": "2023-06-05 10:10:30"
  },
  {
    "user": "idontdocrimes",
    "rating": 5,
    "comment": "they really think im a cop lolol",
    "date": "2023-06-05 10:09:31"
  }
]
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - If something goes wrong on the server or the database, returns an error message: `Something on the server went wrong!`

## *Adds a review for a vehicle*
**Request Format:** /reviews/new

**Request Type:** POST

**Returned Data Format:** JSON

**Description:** After a user have purchased a vehicle, they can leave a rating and comment on the vehicle, the new review is then returned

**Example Request:** /reviews/new with POST parameters of `vehicle=Police` `rating=3`, and `comment=getting outdated, we need upgrades`

**Parameters:**
- `vehicle`: name of vehicle
- `rating`: 1-5 rating of the vehicle
- `comment`: comment on the review

**Example Response:**

```json
{
  "user": "idontdocrimes",
  "rating": 5,
  "comment": "they really think im a cop lolol",
  "date": "2023-06-05 10:09:31"
}
```

**Error Handling:**
- Posible 400 errors (all plain text):
  - If the user is not logged in, returns error message: `Not enough / incorrect information provided. Please Log In.`
  - If the user provides a rating outside of 1-5 range, returns error message `Not enough / incorrect information provided. Please Log In.`
  - If the user have not purchased the selected vehicle before reviewing, returns error message: `You have not purchased this vehicle.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server or the database, returns an error message: `Something on the server went wrong!`

## *creates a new account*
**Request Format:** /account/create

**Request Type:** POST

**Returned Data Format:** JSON

**Description:** creates a new account when a user signs up

**Example Request:** /account/create with POST parameters of `username=johnsmith123`, `email=johnsmith123@outlook.com`, and `password=Password123`

**Parameters:**
- `username`: user's selected username
- `email`: user's email address
- `password`: user's password

**Example Response:**

```json
{
  "username": "JohnSmith123",
  "password": "Password123"
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - if email is linked to an existing account, an error is returned with the message: `An account with that email address already exists.`
  - if selected username is taken, an error is returned with the message: `Username already taken`
  - if either username, email, or password is not provided, an error is returned with the message: `A field is missing!`
- Possible 500 errors (all plain text):
  - if something goes wrong on the server or the database, returns an error message: `Something on the server went wrong!`

## *Returns user balance*
**Request Format:** /balance

**Request Type:** GET

**Returned Data Format:** Plain text

**Description:** When a user wants to deposit, shows current balance in their account

**Example Request:** /balance

**Parameters:**
- none

**Example Response:**

```
25000
```

**Error Handling:**
- Posible 400 errors (all plain text):
  - If the user is not logged in, returns error message: `Not logged in`
  - If username does not exist, returns error message `Username does not exist.`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server or the database, returns an error message: `Something on the server went wrong`

## *Make deposit*
**Request Format:** /deposit

**Request Type:** POST

**Returned Data Format:** Plain text

**Description:** When a user makes a deposit, updates their account balance

**Example Request:** /deposit with POST parameters of `amount=25000`

**Parameters:**
- `amount`: amount of money to be deposited

**Example Response:**

```
Deposit Successful
```

**Error Handling:**
- Posible 400 errors (all plain text):
  - If the user is not logged in, returns error message: `Not logged in`
  - If the user does not specify deposit amount, returns error message `Insert deposit amount`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server or the database, returns an error message: `Something on the server went wrong`

## *Accessing transaction history*
**Request Format:** /account/history

**Request Type:** GET

**Returned Data Format:** JSON

**Description:** When a user checks their transaction history, returns information of all history associated with that account including the name of the vehicle and confirmation code

**Example Request:** /account/history

**Parameters:**
- none

**Example Response:**

```json
[
  {
    "vehicle": "Avenger",
    "date": "2023-06-04 18:18:20",
    "code": 123846981
  },
  {
    "vehicle": "Police",
    "date": "2023-06-03 16:30:14",
    "code": 1345
  },
  {
    "vehicle": "Police",
    "date": "2023-06-03 11:20:14",
    "code": 12345
  }
]
```

**Error Handling:**
- Posible 400 errors (all plain text):
  - If the user is not logged in, returns error message: `Not Logged In`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server or the database, returns an error message: `Something on the server went wrong`

## *Makes a purchase of vehicle(s)*
**Request Format:** /vehicles/buy/:vehicle_name

**Request Type:** POST

**Returned Data Format:** Plain text

**Description:** When a user attempts to make a purchase, checks to see if transaction can be made. For a purchase to be successful, a user must be logged in, have enough money in their balance to purchase the vehicle, and the vehicle needs to be in stock. If purchase is successful, transaction code is returned

**Example Request:** /purchase with POST parameters of `purchase={"asterope":{"name":"Asterope","id":"asterope","img-src":"img/vehicles/asterope.png","img-alt":"Asterope","price":15000,"count":1}}`

**Parameters:**
- `purchase`: information as to which vehicles to be purchased

**Example Response:**

```
123456
```

**Error Handling:**
- Posible 400 errors (all plain text):
  - If the user is not logged in and tries to make a purchase, returns error message: `Not enough information to make purchase! Please Log In!`
  - If the selected vehicle is out of stock, returns error message: `We do not have enough vehicles left in stock!`
  - If the user does not have enough money to buy a vehicle, returns error message: `You do not have enough money in your account to make the purchase!`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server or the database, returns an error message: `Oops! Something went wrong. Transaction Failed. Please try again later. :(`