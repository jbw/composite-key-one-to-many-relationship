## Create a postgresql database in Docker

```sh
docker run \
    -p 5455:5432 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=composite-key-one-to-many-relationship-data \
    -d postgres
```

## Apply migrations

```sh
 npx mikro-orm migration:fresh
```

## Run the app

```sh
yarn start:dev
```
