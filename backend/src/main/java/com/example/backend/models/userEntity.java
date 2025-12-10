package com.example.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_entity")
public class userEntity {

    @Id
    @Column(nullable = false, unique = true) 
    private String email;

    @Column(nullable = false)
    private String pass;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String mobileNo;

    @Column(nullable = false)
    private String role;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username; 
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass; 
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email; 
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo; 
    }
}
