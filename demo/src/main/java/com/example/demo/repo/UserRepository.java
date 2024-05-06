package com.example.demo.repo;

import org.springframework.data.cassandra.repository.CassandraRepository;

import com.example.demo.model.User;
import com.example.demo.model.UserPrimaryKey;

public interface UserRepository extends CassandraRepository<User, UserPrimaryKey> {
    // You can define custom queries here if needed
}