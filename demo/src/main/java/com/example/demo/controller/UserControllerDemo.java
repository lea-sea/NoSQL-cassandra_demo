package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import com.example.demo.model.*;
import com.example.demo.repo.UserRepositoryDemo;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@RestController
@RequestMapping("/api-demo")
public class UserControllerDemo {
    
    @Autowired
    public UserRepositoryDemo userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserDemo>> getAllUsers() {
        List<UserDemo> users = new ArrayList<UserDemo>();
        userRepository.findAll().forEach(users::add);

        if (users.isEmpty()) {
            return new ResponseEntity<>(null,HttpStatus.OK);
          }
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @GetMapping("/users/byName/{name}")
    public ResponseEntity<List<UserDemo>> getAllUsersByName(@PathVariable String name) {
        List<UserDemo> users = new ArrayList<UserDemo>();
        userRepository.findByName(name).forEach(users::add);

        if (users.isEmpty()) {
            return new ResponseEntity<>(null,HttpStatus.OK);
          }
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @GetMapping("/{userEmail}/{creationDate}")
    public ResponseEntity<UserDemo> getUserById(@PathVariable String userEmail, @PathVariable String creationDate) {
        //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime localDate = LocalDateTime.parse(creationDate);

        UserPrimaryKeyDemo pk = new UserPrimaryKeyDemo(userEmail, localDate);
        Optional<UserDemo> optionalUser = userRepository.findById(pk);
        return optionalUser.map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<UserDemo> createUser(@RequestBody UserDemo user) {
        UserDemo savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PutMapping("/{userEmail}/{creationDate}")
    public ResponseEntity<UserDemo> updateUser(@PathVariable String userEmail, @PathVariable String creationDate, @RequestBody UserDemo newUser) {
        //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime localDate = LocalDateTime.parse(creationDate);

        Optional<UserDemo> optionalUser = userRepository.findById(new UserPrimaryKeyDemo(userEmail, localDate));
        if (optionalUser.isPresent()) {
            UserDemo user = optionalUser.get();
            user.setName(newUser.getName());
            UserDemo updatedUser = userRepository.save(user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{userEmail}/{creationDate}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userEmail, @PathVariable String creationDate) {
        //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime localDate = LocalDateTime.parse(creationDate);
        userRepository.deleteById(new UserPrimaryKeyDemo(userEmail,localDate));
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}