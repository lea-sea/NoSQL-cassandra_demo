###### PART I  ######
### Starten (!)
docker start cassandra-1

docker exec -it cassandra-1 cqlsh

describe learn_cassandra.users_by_country_with_leveled_compaction

### Datensätze anzeigen
SELECT * FROM learn_cassandra.users_by_country_with_leveled_compaction;

### Hinzufügen neuer Zeilen : Insert/Update (keine Unterscheidung)
### Neue Zeile hinzufügen (normal)
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('DE','sebastian@example.com', 'Sebastian', 'Mueller', 12); 

### Diese neue Zeile Aktualisieren (normal)
UPDATE learn_cassandra.users_by_country_with_leveled_compaction SET firstname = 'Sebastian Updated with Update', lastname = 'Müller Updated with Update' WHERE country = 'DE' AND user_email = 'sebastian@example.com';

### Aktualisieren mit INSERT(!)
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('DE','sebastian@example.com', 'Sebastian Updated with Insert', 'Mueller Updated with Insert', 12);

### Hinzufügen durch UPDATE(!)
UPDATE learn_cassandra.users_by_country_with_leveled_compaction SET firstname = 'Bob Inserted with Update', lastname = 'Bauer Inserted  with Update', age = 4 WHERE country = 'DE' AND user_email = 'bob@example.com';

### Unterscheidung umsetzen mittels IF NOT EXISTS
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('DE','sebastian@email.com', 'Sebastian Updated with Insert', 'Müller Updated with Insert', 12) IF NOT EXISTS;

### Tupel-Notation Suche - Beispiel unpassend - Nur auf Clustering-Columns anwendbar (Wenn Age ein CK wäre, könnte man auch <,> verwenden um zu Filtern.)
SELECT * FROM learn_cassandra.users_by_country_with_leveled_compaction WHERE (user_email)  = ('alice@example.com') ALLOW FILTERING;

### Partition angeben, dann kein ALLOW FILTERING notwendig
SELECT * FROM learn_cassandra.users_by_country_with_leveled_compaction WHERE country = 'UK' AND (user_email)  = ('alice@example.com');

### mit TTL automatisches "löschen" hervorzurufen (!)
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('DE','elmar@example.com', 'Elmar with TTL', 'Radeberg with TTL', 56) USING TTL 30;

SELECT TTL(firstname) FROM learn_cassandra.users_by_country_with_leveled_compaction WHERE country='DE' and user_email='elmar@example.com'

SELECT * FROM learn_cassandra.users_by_country_with_leveled_compaction

###### --------------------------------------------------------- #####
###### PART II ######
### Cluster/Container erstellen und starten über Docker:
docker run --name cassandra-demo-1 -p 9042:9042 -d cassandra:3.7 

### Existierenden Cassandra-Container starten 
docker start cassandra-demo-1 

### Existierenden Cassandra-Container löschen (mit allen Daten)
docker rm -f cassandra-demo-1

### Prüfen:
docker exec cassandra-demo-1 nodetool status

### SQLSH starten: (!)
docker exec -it cassandra-demo-1 cqlsh

### KeySpaces ausgeben: 
DESCRIBE keyspaces;

### KeySpace anlegen:
CREATE KEYSPACE demo_cassandra  WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy','datacenter1' : 1 };

### Tabellen anlegen: (!)
# User-Stories beachten:
# 1) Als Benutzer möchte ich ToDo-Elemente erstellen können
# 2) Als Benutzer möchte ich die ToDo-Elemente sortiert auflisten können
# 3) Als Benutzer möchte ich ein ToDo-Element mit anderen Benutzern teilen können
#       a) Alle ToDos, die mit einem Benutzer geteilt werden
#       b) Alle ToDos, die man selbst als Benutzer mit anderen geteilt hat


### 1-2) 
CREATE TABLE demo_cassandra.todo_by_user_email (
    user_email text,
    name text,
    creation_date timestamp,
    PRIMARY KEY ((user_email), creation_date)
) WITH CLUSTERING ORDER BY (creation_date DESC)
AND compaction = { 'class' :  'LeveledCompactionStrategy'  };

### 3a)
CREATE TABLE demo_cassandra.todos_shared_by_target_user_email (
    target_user_email text,
    source_user_email text,
    creation_date timestamp,
    name text,
    PRIMARY KEY ((target_user_email), creation_date)
) WITH CLUSTERING ORDER BY (creation_date DESC)
AND compaction = { 'class' :  'LeveledCompactionStrategy'  };

### 3b) 
CREATE TABLE demo_cassandra.todos_shared_by_source_user_email (
    target_user_email text,
    source_user_email text,
    creation_date timestamp,
    name text,
    PRIMARY KEY ((source_user_email), creation_date)
) WITH CLUSTERING ORDER BY (creation_date DESC)
AND compaction = { 'class' :  'LeveledCompactionStrategy'  };

### (!)
CREATE TABLE demo_cassandra.todo_by_user_email (
    user_email text,
    name text,
    creation_date timestamp,
    PRIMARY KEY ((user_email), creation_date)
) WITH CLUSTERING ORDER BY (creation_date DESC)
AND compaction = { 'class' :  'LeveledCompactionStrategy'  };

CREATE TABLE demo_cassandra.todos_shared_by_target_user_email (
    target_user_email text,
    source_user_email text,
    creation_date timestamp,
    name text,
    PRIMARY KEY ((target_user_email), creation_date)
) WITH CLUSTERING ORDER BY (creation_date DESC)
AND compaction = { 'class' :  'LeveledCompactionStrategy'  };

CREATE TABLE demo_cassandra.todos_shared_by_source_user_email (
    target_user_email text,
    source_user_email text,
    creation_date timestamp,
    name text,
    PRIMARY KEY ((source_user_email), creation_date)
) WITH CLUSTERING ORDER BY (creation_date DESC)
AND compaction = { 'class' :  'LeveledCompactionStrategy'  };

### Datenkonsistenz einhalten mittels BATCH:
BEGIN BATCH
  INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('alice@email.com', '2024-05-20T16:10:00', 'My first todo entry')

  INSERT INTO demo_cassandra.todos_shared_by_target_user_email (target_user_email, source_user_email,creation_date,name) VALUES('bob@email.com', 'alice@email.com','2024-05-20T16:10:00', 'My first todo entry')

  INSERT INTO demo_cassandra.todos_shared_by_source_user_email (target_user_email, source_user_email,creation_date,name) VALUES('alice@email.com', 'bob@email.com', '2024-05-20T16:10:00', 'My first todo entry')
APPLY BATCH;

### 
SELECT * FROM demo_cassandra.todo_by_user_email;
SELECT * FROM demo_cassandra.todos_shared_by_source_user_email;
SELECT * FROM demo_cassandra.todos_shared_by_target_user_email;

### Noch einpaar Daten zum weiter befüllen:
INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('bob@email.com', '2024-05-20T16:10:00', 'My first todo entry');

INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('bob@email.com', '2024-05-20T16:20:00', 'My second todo entry');

INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('bob@email.com', '2024-05-20T16:30:00', 'My third todo entry');

INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('bob@email.com', '2024-05-20T16:40:00', 'My fourth todo entry');

INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('bob@email.com', '2024-05-20T16:50:00', 'My fifths todo entry');

INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('alice@email.com', '2024-05-20T16:20:00', 'My second todo entry'); 

INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('alice@email.com', '2024-05-20T16:30:00', 'My third todo entry'); 

INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('alice@email.com', '2024-05-20T16:40:00', 'My fourth todo entry');  

INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('alice@email.com', '2024-05-20T16:50:00', 'My fifths todo entry');  

### Daten Abfragen: 
SELECT * FROM demo_cassandra.todos_shared_by_target_user_email WHERE target_user_email='bob@email.com';

SELECT * FROM demo_cassandra.todo_by_user_email WHERE user_email='bob@email.com';

### Daten Abfragen die kein Primary Key sind
SELECT * FROM demo_cassandra.todo_by_user_email WHERE name='My third todo entry';

SELECT * FROM demo_cassandra.todo_by_user_email WHERE name='My third todo entry' ALLOW FILTERING;

### erste Tabelle :
### 1) 
docker run --name cassandra-1 -p 9042:9042 -d cassandra:3.7
$INSTANCE1=$(docker inspect --format="{{ .NetworkSettings.IPAddress }}" cassandra-1)
echo "Instance 1: ${INSTANCE1}"

### 2)
docker exec -it cassandra-1 cqlsh

### 3) 
CREATE KEYSPACE learn_cassandra  WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy','datacenter1' : 3 };

### 4)
CREATE TABLE learn_cassandra.users_by_country_with_leveled_compaction (
      country text,
      user_email text,
      age int,
      firstname text,
      lastname text,
      PRIMARY KEY (country, user_email)
) WITH CLUSTERING ORDER BY (user_email ASC);

### 5)
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('UK','alice@example.com', 'Alice', 'Green', 27); 
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('UK','grace@example.com', 'Grace', 'Miller', 40); 
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('UK','sam@example.com', 'Sam', 'Nelson', 31); 
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('DE','frank@example.com', 'Frank', 'Foster', 24); 
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('DE','paul@example.com', 'Paul', 'Zimmermann', 42); 
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('NL','leo@example.com', 'Leo', 'Roberts', 22); 
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('USA','bob@example.com', 'Bob', 'Turner', 30);
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('USA','wendy@example.com', 'Wendy', 'White', 32);  
INSERT INTO learn_cassandra.users_by_country_with_leveled_compaction (country,user_email,firstname,lastname, age) VALUES('CZ','mia@example.com', 'Mia', 'Nelson', 25); 

### 6)
SELECT * FROM learn_cassandra.users_by_country_with_leveled_compaction;