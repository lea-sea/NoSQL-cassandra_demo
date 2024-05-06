package com.example.demo.model;

import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;

import java.io.Serializable;

@PrimaryKeyClass
public class UserPrimaryKey implements Serializable {

    public UserPrimaryKey(String country, String userEmail) {
        this.country = country;
        this.userEmail = userEmail;
    }

    @PrimaryKeyColumn(name = "country", type = PrimaryKeyType.PARTITIONED)
    private String country;

    @PrimaryKeyColumn(name = "user_email", ordinal = 0, type = PrimaryKeyType.CLUSTERED)
    private String userEmail;

    // Constructors, getters, and setters

   public String getCountry() {
        return country;
    }

    public String getUserEmail() {
        return userEmail;
    }
 /*
    public void setCountry(String country) {
        this.country = country;
    }

    

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }*/

}