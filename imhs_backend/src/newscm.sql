PRAGMA foreign_keys = ON;
-- User table
DROP TABLE IF EXISTS User;
CREATE TABLE User (
    U_id INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- Home table
DROP TABLE IF EXISTS Home;
CREATE TABLE Home (
    H_id INTEGER PRIMARY KEY,
    U_id INTEGER NOT NULL,
    H_name TEXT NOT NULL,
    FOREIGN KEY (U_id) REFERENCES User(U_id)
);

-- Room table
DROP TABLE IF EXISTS Room;
CREATE TABLE Room (
    r_id INTEGER PRIMARY KEY,
    r_name TEXT NOT NULL,
    H_id INTEGER NOT NULL,
    FOREIGN KEY (H_id) REFERENCES Home(H_id)
);

-- Board table
DROP TABLE IF EXISTS Board;
CREATE TABLE Board (
    B_id INTEGER PRIMARY KEY,
    B_name TEXT NOT NULL,
    r_id INTEGER NOT NULL,
    Status INTEGER CHECK(Status IN (0,1)), -- 0 = off, 1 = on
    FOREIGN KEY (r_id) REFERENCES Room(r_id)
);

-- Temp table
DROP TABLE IF EXISTS Temp;
CREATE TABLE Temp (
    Temp_id INTEGER PRIMARY KEY,
    Temp REAL,
    humi REAL
);

-- Fire table
DROP TABLE IF EXISTS Fire;
CREATE TABLE Fire (
    fire_id INTEGER PRIMARY KEY,
    Fire_dt INTEGER CHECK(Fire_dt IN (0,1)), -- 0 = no fire, 1 = fire detected
    fire_level INTEGER
);

-- Gas status table
DROP TABLE IF EXISTS gas_st;
CREATE TABLE gas_st (
    gas_id INTEGER PRIMARY KEY,
    lpg REAL,
    co2 REAL,
    ch4 REAL
);

-- Board report table
DROP TABLE IF EXISTS Breport;
CREATE TABLE Breport (
    br_id INTEGER PRIMARY KEY,
    B_id INTEGER NOT NULL,
    Temp_id INTEGER NOT NULL,
    fire_id INTEGER NOT NULL,
    gas_id INTEGER NOT NULL,
    Date TEXT, -- ISO8601 format recommended
    FOREIGN KEY (B_id) REFERENCES Board(B_id),
    FOREIGN KEY (Temp_id) REFERENCES Temp(Temp_id),
    FOREIGN KEY (fire_id) REFERENCES Fire(fire_id),
    FOREIGN KEY (gas_id) REFERENCES gas_st(gas_id)
);