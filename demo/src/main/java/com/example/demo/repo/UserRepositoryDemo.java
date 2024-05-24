package com.example.demo.repo;

import java.util.List;

import org.springframework.data.cassandra.repository.AllowFiltering;
import org.springframework.data.cassandra.repository.CassandraRepository;

import com.example.demo.model.UserDemo;
import com.example.demo.model.UserPrimaryKeyDemo;


public interface UserRepositoryDemo extends CassandraRepository<UserDemo, UserPrimaryKeyDemo> {

    // You can define custom queries here if needed

    @AllowFiltering
    List<UserDemo> findByName(String name);
}