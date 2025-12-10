package com.example.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Repository.UserRepo;
import com.example.backend.models.userEntity;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class userController {

	@Autowired
	private UserRepo userRepo;
	@GetMapping("/off")
	public List<userEntity> getOffUsers() {
	    return userRepo.findByRole("off");
	}

}
