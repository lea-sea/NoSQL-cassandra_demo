package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

@Table("users_by_country_with_leveled_compaction")
public class User {

    @Id
    @PrimaryKey
    private UserPrimaryKey primaryKey;

    private String firstName;
    private String lastName;
    private int age;

    public User() {
        // Default constructor required by Spring Data Cassandra
    }

    public User(UserPrimaryKey primaryKey, String firstName, String lastName, int age) {
        this.primaryKey = primaryKey;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }

    // Getters and setters

    public UserPrimaryKey getPrimaryKey() {
        return primaryKey;
    }

    public void setPrimaryKey(UserPrimaryKey primaryKey) {
        this.primaryKey = primaryKey;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{" +
                "primaryKey=" + primaryKey.getCountry() + " " + primaryKey.getUserEmail() +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", age=" + age +
                '}';
    }
}
