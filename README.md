# API Documentation

## Description

This API works as a registration and management system. It was developed with node.js, koaJS, and typeORM. The API is integrated with a PostgreSQL database. It is deployed to an EC2 instance.

## Functionalities

- **Users Authentication**
- **Account Editing**
- **Users Listing (if user is admin)**

## Tech Stack

- **Backend:** Node.js, TypeORM, KoaJS 
- **Database:** PostgreSQL
- **Authentication:** JWT, AWS Cognito
- **Others:** Docker, GitHub Actions

## Authentication

The API uses **JWT** for authentication. After signing in or registering, a token will be returned. To access protected endpoints, include the token in the request header, the `/auth` and `/` routes are public, and the `/me`, `/edit-account`, and `/users` are protected/private.

## Testing

You can send requests to the API running on an EC2 instance by requesting the `56.124.75.60` address on the `3000` port.

## Endpoints

### 1. Hello, World

- **GET** `/`
  - Description: Hello World endpoint.
  - Response:
    ```json
    {
      "message": "Hello, World!"
    }
    ```


### 2. Authentication

- **POST** `/auth`
  - Description: The endpoint acts as a signInOrRegister. Authenticate the user using and return a JWT token.
  - Body:
    ```json
    {
      "name": "Tester",
      "email": "email@exemple.com",
      "password": "Passw@rd123"
    }
    ```
  - Response:
    ```json
    {
      "message": "User authenticated",
      "token": "valid_token",
      "user":{
        "id":1,
        "email": "email@exemple.com",
        "name": "Tester",
        "role": "user",
        "isOnboarded": false,
        "createdAt": "now",
        "updatedAt": "now",
        "deletedAt": null
      }
    }
    ```

### 3. Retrieve User's info

- **GET** `/me`
  - Description: Retrieve user's info.
  - Response:
    ```json
    {
    "user": {
        "sub": "something",
        "cognito:groups": [
            "user"
        ],
        "email_verified": true,
        "iss": "something",
        "cognito:username": "something",
        "origin_jti": "something",
        "aud": "somethin",
        "event_id": "something",
        "token_use": "id",
        "auth_time": something,
        "name": "Tester",
        "exp": something,
        "iat": something,
        "jti": "something",
        "email": "email@example.com"
    }
    ```

### 3. List Users (admins only)

- **GET** `/users`
  - Description: Return a list of the users registered, only admins are allowed.
  - Response:
    ```json
    [
      "user":{
        "id":1,
        "email": "email@exemple.com",
        "name": "Tester",
        "role": "user",
        "isOnboarded": false,
        "createdAt": "some-date",
        "updatedAt": "some-date",
        "deletedAt": null
      },
      "user":{
        "id":2,
        "email": "email2@exemple.com",
        "name": "Tester2",
        "role": "admin",
        "isOnboarded": true,
        "createdAt": "some-date",
        "updatedAt": "some-date",
        "deletedAt": null
      }
    ]
    ```

### 4. Edit User

- **PUT** `/users/edit-account`
  - Description: If the user is an admin it can edit the user's role, otherwise only the name is editable. Upon editing the onboarding status is set to true.
  - Body:
    ```json
    {
      "name": "Tester2",
    }
    ```
  - Response:
    ```json
    {
      "message": "Account updated",
      "user":{
        "id":2,
        "email": "email2@exemple.com",
        "name": "Tester2",
        "role": "admin",
        "isOnboarded": true,
        "createdAt": "some-date",
        "updatedAt": "now",
        "deletedAt": null
      }
    }
    ```
