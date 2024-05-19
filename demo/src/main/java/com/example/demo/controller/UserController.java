package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.model.UserPrimaryKey;
import com.example.demo.repo.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
public class UserController {
    
    @Autowired
    public UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = new ArrayList<User>();
        userRepository.findAll().forEach(users::add);

        if (users.isEmpty()) {
            return new ResponseEntity<>(null,HttpStatus.OK);
          }
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @GetMapping("/users/byLastName/{lastName}")
    public ResponseEntity<List<User>> getAllUsersByName(@PathVariable String lastName) {
        List<User> users = new ArrayList<User>();
        userRepository.findByLastName(lastName).forEach(users::add);

        if (users.isEmpty()) {
            return new ResponseEntity<>(null,HttpStatus.OK);
          }
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @GetMapping("/users/byAge/{age}")
    public ResponseEntity<List<User>> getAllUsersByAge(@PathVariable Integer age) {
        List<User> users = new ArrayList<User>();
        userRepository.findByAge(age).forEach(users::add);

        if (users.isEmpty()) {
            return new ResponseEntity<>(null,HttpStatus.OK);
          }
        return new ResponseEntity<>(users,HttpStatus.OK);
    }

    @GetMapping("/{country}/{userEmail}")
    public ResponseEntity<User> getUserById(@PathVariable String country, @PathVariable String userEmail) {
        UserPrimaryKey pk = new UserPrimaryKey(country, userEmail);
        Optional<User> optionalUser = userRepository.findById(pk);
        return optionalUser.map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PutMapping("/{country}/{userEmail}")
    public ResponseEntity<User> updateUser(@PathVariable String country, @PathVariable String userEmail, @RequestBody User newUser) {
        Optional<User> optionalUser = userRepository.findById(new UserPrimaryKey(country, userEmail));
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setFirstName(newUser.getFirstName());
            user.setLastName(newUser.getLastName());
            user.setAge(newUser.getAge());
            User updatedUser = userRepository.save(user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{country}/{userEmail}")
    public ResponseEntity<Void> deleteUser(@PathVariable String country, @PathVariable String userEmail) {
        userRepository.deleteById(new UserPrimaryKey(country, userEmail));
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}