# _Link NIN to SIM_

_This repository contains a mock up Nodejs Project that implements APIs for linking National Identity Numbers to users' Sim cards as mandated by the federal government._

## Project Setup

### Prerequisites

1. Node v14.x
2. NPM
3. MySQL database service

### Installation

- Mac OS X
- Ubuntu
- Windows

### Terminal Commands

1. Clone the repository into your local machine.
2. run `cd link-nin-to-sim`
3. run `npm install`
4. start your mySQL service if it is not already running.
5. create a database schema "example_db"
6. create `.env` file in the root directory to store your environment variables
7. setup your `.env` as follows.

   ```
   dbUsername=your_db_username
   dbPassword=your_db_password
   dbName=example_db
   dbHost=127.0.0.1
   dialect=mysql
   ```

8. run `npx sequelize-cli db:migrate`
9. run `npx sequelize-cli db:seed:all`
10. run `npm run dev` for development server or `npm start` for production

#### Tests
- run `npm run test` on the root directory

### Dependencies

- _[Sequelize ORM](https://sequelize.org/master/)_
- _[Babel Compiler](https://babeljs.io/)_

### Getting started

#### Project's Assumptions

- Users should have valid and registered phone Numbers, hence, a central database that holds all sim card registration records should be consulted to validate a phone number before a link can be established.
  Therefore, we are assuming we have access to such database. This Collection contains APIs for users to register their sim cards with us before proceeding to link to NIN.
- Users should have valid NIN [National Identity Numbers](https://nimc.gov.ng/about-nin/), hence, a central database that holds all NIN registration records should be consulted to validate a users' NIN before a link can be established.
  Therefore, we are also assuming we have access to such database. This Collection contains APIs for users to register their NIN with us before proceeding to link to phone Number.
- We also assume that every user that has obtained their NIN from us owns an online Wallet with us. The user is prompted to credit his/her wallet with a starting balance of N2000 by default upon successful NIN registration. This is because linking NIN to phone Number attracts charges.
- We assume that the default charges per NIN-to-Phone-number link request is N500. This value can be updated.

## Usage

- use the sim card registration API to Register or Verify your sim card
- use the NIN registration API to Register or Verify your NIN
- use the NIN-to-Phone API to link your Phone number to your NIN
- user gets charged for link request
- use the Reports API to get reports about all link requests. This API also contains some statistical data about total billed amount and total available balance across all users registered in the system
- use the System Settings API to update system settings. (e.g: charge per request)

## Documentations

- [Postman Documentation](https://documenter.getpostman.com/view/15104524/TzXxmJRK)

## Live Demo API link

- [Link NIN to SIM API](https://link-nin-to-sim.herokuapp.com)

## Team

- [Afiukwa Williams](https://linkedin.com/in/williamsafiukwa) _(Software Engineer)_

## Copyright and attribution

Copyright (c) 2021. Released under the [MIT License](https://github.com/datamade/your-repo-here/blob/master/LICENSE).
