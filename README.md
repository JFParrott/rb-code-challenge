# Mars Robot Orienteering - Red Badger Coding Challenge

## Approach:

1. Read and understand requirements
2. Provide Claude with context of problem state, business logic and high-level specifications i.e. technology choices
3. Instruct Claude that a test driven approach should be used
4. Have Claude produce test suite, ensuring to identify any edge cases and test limits
5. Review and refine test suite manually to ensure readability and coverage
6. Have Claude generate implementation
7. Review and refine implementation, sense checking the approach
8. Improve readability of implementation
9. Run test suite and validate results, improving where necessary
10. Try to break program to identify additional edge cases

### When I chose to avoid AI

- Requirements interpretation
- Architecture
- Technical decisions i.e. selecting language, testing framework etc
- Verification of tests and implementation
- Code quality
- Final acceptance
- Creation of README

## Setup

In order to run the program, first install necessary dependencies:

- npm ci

## Running

In order to run the program using a .txt file as input (where each new line represents a new command)

- npm start -- testfile.txt

Or alternatively, the program can be ran interactively with:

- npm start

## Next Steps

### API

I would expose the program through a REST API built using Node.js and TypeScript, using a lightweight framework like Fastify or Express.

If the program was to grow in size and complexity, I would consider exposing the API via a API Gateway / APIM so as to provide authentication, rate limiting, routing and API versioning. However I would not start with this as simple HTTP triggers on AWS Lambdas / Azure Functions would suffice.

The API would provide endpoints to:

- Create a simulation session with defined boundaries.
- Create robots with an initial position and orientation.
- Submit instructions to an existing robot.
- Retrieve the current position and status of a robot.
- Retrieve the history of movements and lost robots.

### Business Logic

Business logic would sit within some serverless cloud services i.e. Azure Functions / AWS Lambda, with HTTP Triggers.

### UI

A simple web interface built using React could then consume this API, allowing users to interact with the simulation and visualise robot movements on a grid.

### Housing the Data

In order to cater for persistence of data across application restarts I would consider using an SQL database (due to the structured nature of the data) to persist:

- Simulation sessions and their grid boundaries.
- Robot positions, orientations, and statuses.
- Robot instruction history.
- Locations and directions associated with robot scents.

This would allow users to resume simulations, inspect previous results, and maintain state across application restarts.

### Deploy

Deployment of services would be done automatically upon successful merge of pull requests to main, via CI/CD.

### CI/CD

I would configure a CI/CD pipeline using a service like GitHub Actions to run linting, TypeScript compilation, and automated tests before deployment.

### Traceability

Introduce structured logging, health checks, and basic monitoring to support troubleshooting and operational reliability.
