# **Motor Nation** API Documentation
The Motor Nation API provides information about all of the vehicles in the database that we sell as well as users' transaction history.


## *Get a list of vehicles matching filter parameters*
**Request Format:** /vehicles?maxPrice=X&type=Y&search=Z

**Request Type:** GET

**Returned Data Format**: Plain text

**Description:** Return a list of all vehicles matching the given type and price filters.


**Example Request:** /vehicles?maxPrice=10000&type=car

**Parameters:**
- `maxPrice`: the maximum price of returned vehicles (i.e. 10000, 20000)
- `type`: the type of vehicle returned (i.e. car, boat)
- `search`: input that user enters to search for, can be empty

**Example Response:**

```
SUV:suv
Coupe:coupe
Station Wagon:station-wagon
Pickup Truck:pickup-truck
...
```

**Error Handling:**
N/A

## *Check if username and password exist*
**Request Format:** /users

**Request Type:** POST

**Returned Data Format**: Plain text

**Description:** When a user submits a username and password, checks if the username and password pair exists in the database and returns a success or failure response.

**Example Request:** /users with POST parameters of `username=example@abc.com` and `password=ABC123`

**Parameters:**
- `username`: user's email
- `password`: user's password

**Example Response:**

```
Success
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - if email does not exist in database, an error is returned with the message: `No account is linked to this emaill adresss.`
  - if email exists, but password is incorrect, an error is returned with the message: `The username and password do not match, please try again.`

## *Get data of a specific vehicle*
**Request Format:** /vehicles/:vehicle_name

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** When a user clicks on a vehicle, returns information about the vehicle

**Example Request:** /vehicles/fordf-150

**Parameters:**
- `vehicle_name`: short name/identifier of the vehicle

**Example Response:**

```json
{
    "name": "Ford F-150",
    "type": "pickup-truck",
    "price": 30000,
    "color": "white",
    "remaining": 500,
    "image": "images/vehicles/fordf-150.png",
    "ratings": [
      {
        "star": 5,
        "comment": "murica baby"
      },
      {
        "star": 3,
        "comment": "eats too much gas"
      }
    ]
}
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - If something goes wrong on the server or the database, returns an error message: `Oops! Something went wrong. Unable to load. Please try again later. :(`

## *Purchasing a vehicle*
**Request Format:** /vehicles/:vehicle_name/buy

**Request Type:** POST

**Returned Data Format**: TEXT

**Description:** When a user attempts to make a purchase, checks to see if transaction can be made. For a purchase to be successful, a user must be logged in, have enough money in their balance to purchase the vehicle, and the vehicle needs to be in stock

**Example Request:** /vehicles/fordf-150/buy with POST parameters of `loggedIn=true`,`balance=50000`, and `remaining=500`

**Parameters:**
- `loggedIn`: whether user is logged in or not
- `balance`: amount of money a user have in their account
- `remaining`: amount of given vehicle in stock

**Example Response:**

```
// Success
123456

// Failure
"No More Left in Stock!"
```

**Error Handling:**
- Posible 400 errors (all plain text):
  - If the user is not logged in and tries to make a purchase, returns error message: `Please log in before making a purchase!`
  - If the selected vehicle is out of stock, returns error message: `This vehicle is out of stock. Please browse for other vehicles or check back in the future!`
  - If the user does not have enough money to buy a vehicle, returns error message: `Your account balance is not enough to buy this vehicle!`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server or the database, returns an error message: `Oops! Something went wrong. Transaction Failed. Please try again later. :(`

## *Accessing transaction history*
**Request Format:** /account/history

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** When a user checks their transaction history, returns information of all history associated with that account including the name of the vehicle and confirmation code

**Example Request:** /account/default_username/history with POST parameters of `loggedIn=true`, `account=example@123.com`

**Parameters:**
- `loggedIn`: whether user is logged in or not
- `account`: username of the account that is logged in

**Example Response:**

```json
// Success
{
    "purchases": [
      {
        "vehicle": "Ford F-150",
        "code": 123456
      },
      {
        "vehicle": "Tank",
        "code": 654321
      }
    ]
}
```

**Error Handling:**
- Posible 400 errors (all plain text):
  - If the user is not logged in, returns error message: `Please log in!`
- Possible 500 errors (all plain text):
  - If something goes wrong on the server or the database, returns an error message: `Oops! Something went wrong. Please try again later. :(`