package com.bitespeed.controller;

import com.bitespeed.dto.IdentifyRequest;
import com.bitespeed.dto.IdentifyResponse;
import com.bitespeed.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class IdentifyController {

    private final ContactService contactService;

    public IdentifyController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/identify")
    public ResponseEntity<IdentifyResponse> identify(@RequestBody IdentifyRequest request) {
        if ((request.getEmail() == null || request.getEmail().isBlank()) &&
                (request.getPhoneNumber() == null || request.getPhoneNumber().isBlank())) {
            return ResponseEntity.badRequest().build();
        }
        IdentifyResponse response = contactService.identify(request);
        return ResponseEntity.ok(response);
    }
}
