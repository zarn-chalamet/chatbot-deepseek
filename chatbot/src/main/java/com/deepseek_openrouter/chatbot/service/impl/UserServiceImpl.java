package com.deepseek_openrouter.chatbot.service.impl;

import com.deepseek_openrouter.chatbot.model.User;
import com.deepseek_openrouter.chatbot.model.UserRole;
import com.deepseek_openrouter.chatbot.repository.UserRepository;
import com.deepseek_openrouter.chatbot.request.LoginRequest;
import com.deepseek_openrouter.chatbot.request.RegisterRequest;
import com.deepseek_openrouter.chatbot.response.UserDataResponse;
import com.deepseek_openrouter.chatbot.security.UserDetailsImpl;
import com.deepseek_openrouter.chatbot.security.jwt.JwtAuthenticationResponse;
import com.deepseek_openrouter.chatbot.security.jwt.JwtUtils;
import com.deepseek_openrouter.chatbot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public User findUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found with id: "+userId));
    }

    @Override
    public void registerNewUser(RegisterRequest registerRequest) {
        //check user's email first
        Optional<User> existingUser = userRepository.findByEmail(registerRequest.getEmail());
        if(existingUser.isPresent()){
            throw new IllegalArgumentException("User with email "+ registerRequest.getEmail() + " already exists.");
        }

        //register new user
        User newUser = new User();
        newUser.setName(registerRequest.getName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setRole(UserRole.USER);
        //encode password
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        userRepository.save(newUser);
    }

    @Override
    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);

        return new JwtAuthenticationResponse(jwt);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email : "+ email));
    }

    @Override
    public void updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public UserDataResponse getUserData(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(()-> new RuntimeException("User not found with email: "+userDetails.getUsername()));

        UserDataResponse userDataResponse = new UserDataResponse();
        userDataResponse.setName(user.getName());
        userDataResponse.setEmail(user.getEmail());
        userDataResponse.setCreatedAt(user.getCreatedAt());

        return userDataResponse;
    }
}
