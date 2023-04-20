## Description

This app was implemented using NestJS and is used to provide flight information exposed on an API.

## Notes
This app is composed by a controller and a service for managing flights.

The controller exposes three methods for manipulating the service, being them:
1) GET /flights - Used to get the list of flights
2) POST /flights/endpoint - Used to add a new flight provider endpoint
3) DELETE /flights/endpoint - Used to remove a flight provider endpoint

The service is used to manage the data fetched from the flight providers. 
This service uses caching to allows faster access to data when getting the list of flights, to do so it checks for flights providers when the app starts and then every 30 seconds.
The flights caching strategy is described next:

For each endpoint:
1) Check if there is a list of flights not expired (the list of flights for each endpoint expires after 1 hour)
2) If there is some data, add it to the list of flights and indicates that this endpoint data haven't changed.
3) If there is no data or it is expired, load the data again from the endpoint and indicates that the endpoint data have changed.

With the data for each endpoint:
1) Get the cached global list of flights (it never expires)
2) If any data of the endpoints have changed or if the global list of flights is not available, update the global list of flights.
3) If nothing changed, return the cached list of flights.

With this strategy, the flights of each endpoint is cached and reload only when it expires, and if nothing is expired, a cached unique list of flights is returned very fast. If something is expired, only this endpoint is reload, without needing to load the others. As there is a task checking for changes every 30 seconds, it ensures that even if the client doesn't request the api often, the data will still be cached and updated.

For the providers management, when a new endpoint is added, the recurrent task will detect it and load it to global list of flights. If it is removed, the cached global list of flights is cleared along with the list of flights for the endpoint being removed, and this ensures that the recurrent task will update the list of flights without needing to fetch data from the other endpoints.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
