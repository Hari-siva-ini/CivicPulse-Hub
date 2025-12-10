package com.example.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.example.backend.Repository.UserRepo;
import com.example.backend.models.userEntity;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins="http://localhost:3000")
public class RegisterController {
    
    @Autowired
    private UserRepo userRepo;
    
    @PostMapping("/reg")
    public String registerUser(@RequestBody userEntity user)
    {
        if(userRepo.existsByEmail(user.getEmail())) 
        {
            return "Already Existing User";            
        }
        userRepo.save(user);
        return "Registered Successfully!";
    }
}
