CREATE TABLE "vehicles" (
	"name"	TEXT NOT NULL,
	"type"	TEXT NOT NULL,
	"price"	REAL NOT NULL,
	"in-stock"	INTEGER NOT NULL,
	"rating"	NUMERIC,
	"picture"	TEXT NOT NULL,
	"description"	TEXT,
	PRIMARY KEY("name")
);

CREATE TABLE "users" (
	"email"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"balance"	INTEGER NOT NULL,
	PRIMARY KEY("email")
);

CREATE TABLE "reviews" (
	"vehicle"	TEXT NOT NULL,
	"user"	TEXT NOT NULL,
	"rating"	INTEGER NOT NULL,
	"comment"	TEXT,
	"date"	DATETIME DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE "transactions" (
	"id"	INTEGER,
	"user"	TEXT NOT NULL,
	"vehicle"	TEXT NOT NULL,
	"code"	INTEGER NOT NULL,
	"date"	DATETIME DEFAULT (datetime('now', 'localtime')),
	PRIMARY KEY("id" AUTOINCREMENT)
);