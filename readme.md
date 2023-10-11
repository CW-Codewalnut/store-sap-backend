# Store SAP API
Store SAP manages multiple stores, integrates with SAP for real-time data exchange,
and uses Node.js with Express and MSSQL for the backend, offering the flexibility
to use other SQL databases via Sequelize ORM.

## System requirement:
1. NodeJs >= 16
2. NPM >= 8.X
3. SQL Server 2022 - 16.X

## SAP Features

- Petty cash (FBCJ)
- Sale receipts (F-02)
- Expenses (F-02)

## Quick Start

1. Navigate to the root directory of the project and install the required dependencies:

```console
$ npm install
```

2. Rename the file .env.example to .env and provide the necessary credentials.
   If you opt for a different database other than MSSQL, remember to modify the
   dialect within the src/config/config.js file.
   for the quick start just provide the below config. then later you can add as per need:
   ```console
   LOCAL_DB=DATABASE_NAME
   LOCAL_DB_USER=DATABASE_USER
   LOCAL_DB_PASS=DATABSE_PASSWORD
   LOCAL_HOST=HOST_NAME
   LOCAL_PORT=PORT_NUMBER
   ```

3. Execute the database migration process:

```console
$ npx sequelize-cli db:migrate
```

4. Launch the application by running:

```console
$ npm run dev
```

Expected Output:

```console
[1] Environment running on: local
[1] Server is running on port: 3000
[1] Database connection has been established.
```

# Run Test

We employ Jest for our test cases. You can initiate the tests by executing the following command:

```console
$ npm run test
```

Note: There are many useful script such as, generating test report, ESlinting, Prettier formatting
you can use those as per your need.
