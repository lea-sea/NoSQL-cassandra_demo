package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

@Table("todo_by_user_email")
public class UserDemo {

    @Id
    @PrimaryKey
    private UserPrimaryKeyDemo primaryKey;

    private String name;

    public UserDemo() {
        // Default constructor required by Spring Data Cassandra
    }

    public UserDemo(UserPrimaryKeyDemo primaryKey, String name) {
        this.primaryKey = primaryKey;
        this.name = name;
    }

    // Getters and setters

    public UserPrimaryKeyDemo getPrimaryKey() {
        return primaryKey;
    }

    public void setPrimaryKey(UserPrimaryKeyDemo primaryKey) {
        this.primaryKey = primaryKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "primaryKey=" + primaryKey.getUserEmail() + " " + primaryKey.getCreationDate() +
                ", Name='" + name + '\'' +
                '}';
    }
}
