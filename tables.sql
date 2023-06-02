CREATE TABLE "vehicles" (
	"name"	TEXT NOT NULL,
	"type"	TEXT NOT NULL,
	"price"	REAL NOT NULL,
	"in-stock"	INTEGER NOT NULL,
	"rating"	NUMERIC,
	"picture"	TEXT NOT NULL,
	PRIMARY KEY("name")
);

CREATE TABLE "users" (
	"id"	INTEGER,
	"email"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"balance"	INTEGER NOT NULL,
	"first"	TEXT NOT NULL,
	"last"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "reviews" (
	"id"	INTEGER,
	"vehicle"	TEXT NOT NULL,
	"user"	TEXT NOT NULL,
	"rating"	INTEGER NOT NULL,
	"comment"	TEXT,
	"date"	DATETIME DEFAULT (datetime('now', 'localtime')),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "transactions" (
	"id"	INTEGER,
	"user"	TEXT NOT NULL,
	"vehicle"	TEXT NOT NULL,
	"code"	INTEGER NOT NULL,
	"date"	DATETIME DEFAULT (datetime('now', 'localtime')),
	PRIMARY KEY("id" AUTOINCREMENT)
);