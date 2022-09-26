# MikroOrm - Composite key with one to many relationship error

This is a minimal reproduction of an error I'm getting when using a composite key with a one to many relationship.

- [MikroOrm - Composite key with one to many relationship error](#mikroorm---composite-key-with-one-to-many-relationship-error)
  - [Expected behavior](#expected-behavior)
  - [What happens](#what-happens)
  - [Relevant code](#relevant-code)
  - [Steps to reproduce](#steps-to-reproduce)
    - [1. Create a postgresql database in Docker](#1-create-a-postgresql-database-in-docker)
    - [2. Apply migrations](#2-apply-migrations)
    - [3. Run the tests](#3-run-the-tests)
  - [Error produced](#error-produced)

## Expected behavior

- Removing items from the collection and persisting the entity should remove the items from the database.

## What happens

- Error is produced when persisting the entity. See [Error produced](#error-produced)

## Relevant code

Entities with composite key and one to many relationship (order 1-\* orderItem):

- [src/order.entity.ts](https://github.com/jbw/composite-key-one-to-many-relationship/blob/main/src/order.entity.ts)
- [src/order-item.entity.ts](https://github.com/jbw/composite-key-one-to-many-relationship/blob/main/src/order.entity.ts)

Code which removes items from the `order.events` collection

- [src/app.service.ts#L39](https://github.com/jbw/composite-key-one-to-many-relationship/blob/main/src/app.service.ts#L39)

## Steps to reproduce

### 1. Create a postgresql database in Docker

```sh
docker run \
    -p 5455:5432 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=composite-key-one-to-many-relationship-data \
    -d postgres
```

### 2. Apply migrations

```sh
 npx mikro-orm migration:fresh
```

### 3. Run the tests

```sh
yarn test
```

## Error produced

Following is the error produced when running the test:

```
[Nest] 70996  - 26/09/2022, 21:09:53   ERROR [ExceptionsHandler] Trying to query by not existing property OrderEvent.orderId
Error: Trying to query by not existing property OrderEvent.orderId
    at /Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/query/CriteriaNode.js:28:27
    at Array.forEach (<anonymous>)
    at new CriteriaNode (/Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/query/CriteriaNode.js:23:17)
    at new ScalarCriteriaNode (/Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/query/ScalarCriteriaNode.js:9:1)
    at Function.createScalarNode (/Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/query/CriteriaNodeFactory.js:25:22)
    at Function.createNode (/Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/query/CriteriaNodeFactory.js:22:21)
    at Function.createObjectItemNode (/Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/query/CriteriaNodeFactory.js:54:25)
    at /Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/query/CriteriaNodeFactory.js:45:28
    at Array.reduce (<anonymous>)
    at Function.createObjectNode (/Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/query/CriteriaNodeFactory.js:44:45)
```

Removing `orphanRemoval: true` from the `Order` entity produces a _different_ error.

```diff
diff --git a/src/order.entity.ts b/src/order.entity.ts
index 186d6de..937d4f0 100644
--- a/src/order.entity.ts
+++ b/src/order.entity.ts
@@ -14,9 +14,7 @@ export class Order {
   @PrimaryKey()
   companyId: string;

-  @OneToMany(() => OrderEvent, (orderEvent) => orderEvent.order, {
-    orphanRemoval: true,
-  })
+  @OneToMany(() => OrderEvent, (orderEvent) => orderEvent.order)
   events = new Collection<OrderEvent>(this);
```

Rerun tests and the following error is produced:

```
TypeError: Cannot read properties of undefined (reading '0')
    at /Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/AbstractSqlDriver.js:343:88
    at Array.forEach (<anonymous>)
    at /Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/AbstractSqlDriver.js:333:23
    at Array.forEach (<anonymous>)
    at /Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/AbstractSqlDriver.js:331:29
    at Set.forEach (<anonymous>)
    at PostgreSqlDriver.nativeUpdateMany (/Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/knex/AbstractSqlDriver.js:329:14)
    at ChangeSetPersister.persistManagedEntitiesBatch (/Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/core/unit-of-work/ChangeSetPersister.js:174:27)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at ChangeSetPersister.persistManagedEntities (/Users/jbw/code/composite-key-one-to-many-relationship/node_modules/@mikro-orm/core/unit-of-work/ChangeSetPersister.js:147:13)
```
