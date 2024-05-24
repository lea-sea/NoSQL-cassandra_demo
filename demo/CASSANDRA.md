### Cluster erstellen und starten über Docker:
docker run --name cassandra-demo -p 9042:9042 -d cassandra:3.7
$INSTANCE1=$(docker inspect --format="{{ .NetworkSettings.IPAddress }}" cassandra-1)
echo "Instance 1: ${INSTANCE1}"

### Existierenden Cassandra-Contaianer starten
docker start cassandra-1

### Prüfen:
docker exec cassandra-demo nodetool status

### SQLSH starten:
docker exec -it cassandra-demo cqlsh

### KeySpaces ausgeben: 
DESCRIBE keyspaces;

### KeySpace anlegen:
CREATE KEYSPACE demo_cassandra
  WITH REPLICATION = { 
   'class' : 'NetworkTopologyStrategy',
   'datacenter1' : 3 
  };

### Tabellen anlegen:
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

### Datenkonsistenz einhalten mittels BATCH:
BEGIN BATCH
  INSERT INTO demo_cassandra.todo_by_user_email (user_email,creation_date,name) VALUES('alice@email.com', '2024-05-20T16:10:00', 'My first todo entry')

  INSERT INTO demo_cassandra.todos_shared_by_target_user_email (target_user_email, source_user_email,creation_date,name) VALUES('bob@email.com', 'alice@email.com','2024-05-20T16:10:00', 'My first todo entry')

  INSERT INTO demo_cassandra.todos_shared_by_source_user_email (target_user_email, source_user_email,creation_date,name) VALUES('alice@email.com', 'bob@email.com', '2024-05-20T16:10:00', 'My first todo entry')

APPLY BATCH;
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