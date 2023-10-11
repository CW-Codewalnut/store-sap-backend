# Store SAP API
Store SAP manages multiple stores, integrates with SAP for real-time data exchange,
and uses Node.js with Express and MSSQL for the backend, offering the flexibility
to use other SQL databases via Sequelize ORM. [Know more](https://docs.google.com/document/d/1ULlRpf-jDfHKAeWKCAUe1FJY_7_CHd-mLi5Ct5wLt1o)

 Petty Cash | Sales Receipts |
|---------|---------|
| ![Petty Cash](https://dev-assets.codewalnut.com/sap-store/petty-cash.png) | ![Sales Receipts](https://dev-assets.codewalnut.com/sap-store/sales.png) |

| Expenses Accounting | User |
|---------|---------|
| ![Expenses Accounting](https://dev-assets.codewalnut.com/sap-store/expenses.png) | ![User](https://dev-assets.codewalnut.com/sap-store/user.png) |

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
# Available API's
Feel free to explore our range of accessible APIs for experimentation and use.
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/23806839-9a57aa45-b4ba-467c-9c65-524d8d950c71?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D23806839-9a57aa45-b4ba-467c-9c65-524d8d950c71%26entityType%3Dcollection%26workspaceId%3Da68c1bb8-614b-4703-b8f8-c3ff51919c10)

Furthermore, for more detailed information about a specific API, you can refer to the API documentation within Postman, accessible through the options on the right side of the interface.

# Run Test

We employ Jest for our test cases. You can initiate the tests by executing the following command:

```console
$ npm run test
```

Note: There are many useful script such as, generating test report, ESlinting, Prettier formatting
you can use those as per your need.
