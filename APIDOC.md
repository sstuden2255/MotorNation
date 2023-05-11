# **Motor Nation** API Documentation
The Motor Nation API provides information about all of the vehicles in the database that we sell as well as users' transaction history.


## *Get a list of vehicles matching filter parameters*
**Request Format:** /vehicles?maxPrice=X&type=Y

**Request Type:** GET

**Returned Data Format**: Plain text

**Description:** Return a list of all vehicles matching the given type and price filters.


**Example Request:** /vehicles?maxPrice=10000&type=car

**Parameters:**
- `maxPrice`: the maximum price of returned vehicles (i.e. 10000, 20000)
- `type`: the type of vehicle returned (i.e. car, boat)

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

**Example Request:** /userswith POST parameters of `username=example@abc.com` and `password=ABC123`

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
