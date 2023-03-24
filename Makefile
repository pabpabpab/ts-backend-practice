setup: install db-migrate

install:
	npm install

db-migrate:
	npx prisma migrate reset --schema ./src/database/schema.prisma

db-init:
	npx prisma generate --schema ./src/database/schema.prisma

start:
	npm run start