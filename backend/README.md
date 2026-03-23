# About

This project is a combinisation between:

- Nest.js v.10
- Posgtres
- Prisma as an ORM
- JWT Auth (accessToekn & refreshToken)
- Roles Guard (SUPERADMIN, ADMIN, USER, TRANSPORTER)
- Docker :
  - Docker.dev for easy and fast development environment
  - Docker.prod for production environment
- Docker compose :
  - docker-compose.prod for easy and fast development environment
  - docker-compose.prod for production environment

<br>
<br>

# Swagger-ts

- To generate a <b>API TS</b> file from <b>swagger.json</b> :

```
npm run swagger:ts
```

- Then copy the generated file <b>src/api/myApi.ts</b> to your frontend folder

<br>
<br>

# Migration

- Create migration called init :

```
npx prisma migrate dev --name "init"
```
- Deploy migrations to DB :

```
npx prisma migrate deploy
```

- Upload seeds dummies data to DB :

```
npx prisma db seed
```

<br>
<br>

# Run Development environment:

```
docker-compose up --build
```

<br>
<br>

# Run Production environment:

```
docker-compose -f docker-compose.prod.yaml up --build
```

<br>
<br>

# If you are using windows and docker desktop:

- Change in .env POSTGRES_HOST=localhost
- Remove api container from docker-compose.yaml
- Run docker-compose up --build
- Open new terminal
- Run npx prisma migrate dev
- Run npx prisma db seed
- Run npm run start:dev
