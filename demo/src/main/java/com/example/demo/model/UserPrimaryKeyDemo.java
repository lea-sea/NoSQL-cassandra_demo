package com.example.demo.model;

import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;

import org.springframework.data.cassandra.core.cql.PrimaryKeyType;

import java.io.Serializable;
import java.time.LocalDateTime;

@PrimaryKeyClass
public class UserPrimaryKeyDemo implements Serializable {

    public UserPrimaryKeyDemo( String userEmail, LocalDateTime creationDate) {
        this.userEmail = userEmail;
        this.creationDate = creationDate;
    }

    @PrimaryKeyColumn(name = "creation_date", type = PrimaryKeyType.CLUSTERED)
    private LocalDateTime creationDate;

    @PrimaryKeyColumn(name = "user_email", ordinal = 0, type = PrimaryKeyType.PARTITIONED)
    private String userEmail;

    // Constructors, getters, and setters

   public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public String getUserEmail() {
        return userEmail;
    }

}