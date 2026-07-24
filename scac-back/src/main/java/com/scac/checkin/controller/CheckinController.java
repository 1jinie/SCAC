package com.scac.checkin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scac.checkin.dto.CheckinRequest;
import com.scac.checkin.dto.CheckinResponse;
import com.scac.checkin.service.CheckinService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/checkin")
public class CheckinController {
    private final CheckinService checkinService;

    @PostMapping("path")
    public CheckinResponse checkin(@RequestBody CheckinRequest request) {
        
        return checkinService.checkIn(request);
    }
    
}