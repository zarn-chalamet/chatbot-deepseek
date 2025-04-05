package com.deepseek_openrouter.chatbot.service.impl;

import com.deepseek_openrouter.chatbot.exceptions.InvalidTokenException;
import com.deepseek_openrouter.chatbot.model.ForgotPasswordToken;
import com.deepseek_openrouter.chatbot.model.User;
import com.deepseek_openrouter.chatbot.repository.ForgotPasswordRepository;
import com.deepseek_openrouter.chatbot.request.ResetPasswordRequest;
import com.deepseek_openrouter.chatbot.service.ForgotPasswordService;
import com.deepseek_openrouter.chatbot.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ForgotPasswordServiceImpl implements ForgotPasswordService {

    private final int MINUTES = 10;

    private final UserService userService;
    private final ForgotPasswordRepository forgotPasswordRepository;
    private final JavaMailSender javaMailSender;

    public ForgotPasswordServiceImpl(UserService userService, ForgotPasswordRepository forgotPasswordRepository, JavaMailSender javaMailSender) {
        this.userService = userService;
        this.forgotPasswordRepository = forgotPasswordRepository;
        this.javaMailSender = javaMailSender;
    }


    @Override
    public void requestForgotPasswordLink(String email) {
        //find user with email
        User user = userService.findUserByEmail(email);

        //generate forgot password token
        String token = generateToken();

        //save forgot password token to the repository
        ForgotPasswordToken forgotPasswordToken = new ForgotPasswordToken();
        forgotPasswordToken.setUser(user);
        forgotPasswordToken.setToken(token);
        forgotPasswordToken.setUsed(false);
        forgotPasswordToken.setExpiredTime(LocalDateTime.now().plusMinutes(MINUTES));

        forgotPasswordRepository.save(forgotPasswordToken);

        //send link to email
        String emailLink = "http://localhost:5173/auth/reset-password?token=" + token;
        try{
            sendEmail(email,"Password Reset Link", emailLink);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateNewPassword(ResetPasswordRequest resetPasswordRequest) {

        //find the token
        ForgotPasswordToken forgotPasswordToken = forgotPasswordRepository.findByToken(resetPasswordRequest.getToken());

        //check if the token is valid
        checkValidity(forgotPasswordToken);

        //update the user's password
        User user = forgotPasswordToken.getUser();
        userService.updatePassword(user,resetPasswordRequest.getNewPassword());

        //mark token is used
        forgotPasswordToken.setUsed(true);
        forgotPasswordRepository.save(forgotPasswordToken);
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }

    private void sendEmail(String toEmail, String subject, String emailLink) throws MessagingException, UnsupportedEncodingException {

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        String emailContent = "<p>Hello</p>"
                + "Click the link the below to reset password"
                + "<p><a href=\""+ emailLink + "\">Change My Password</a></p>"
                + "<br>"
                + "Ignore this Email if you did not made the request";

        helper.setText(emailContent, true);
        helper.setFrom("zarnn872@gmail.com", "Customer Support");
        helper.setSubject(subject);
        helper.setTo(toEmail);
        javaMailSender.send(message);
    }

    private void checkValidity(ForgotPasswordToken forgotPasswordToken) {
        if (forgotPasswordToken == null){
            throw new InvalidTokenException("Invalid token: Token not found");
        } else if (forgotPasswordToken.isUsed()) {
            throw new InvalidTokenException("Invalid token: Token already used");
        } else if(isExpired(forgotPasswordToken)) {
            throw new InvalidTokenException("Invalid token: Token expired");
        }
    }

    public boolean isExpired (ForgotPasswordToken forgotPasswordToken) {
        return LocalDateTime.now().isAfter(forgotPasswordToken.getExpiredTime());
    }
}
