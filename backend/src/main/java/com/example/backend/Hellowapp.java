package com.example.backend;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
public class Hellowapp {
    @GetMapping("/hello")
   public String Hello()
    {
        return "Hello, World!!!";
    }
}

