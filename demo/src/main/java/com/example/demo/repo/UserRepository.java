package com.example.demo.repo;

import java.util.List;

import org.springframework.data.cassandra.repository.AllowFiltering;
import org.springframework.data.cassandra.repository.CassandraRepository;

import com.example.demo.model.User;
import com.example.demo.model.UserPrimaryKey;

public interface UserRepository extends CassandraRepository<User, UserPrimaryKey> {
    // You can define custom queries here if needed

    @AllowFiltering
    List<User> findByLastName(String lastName);

    List<User> findByAge(int age);
}