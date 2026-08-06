package com.scac.meetingroom.domain;

import com.scac.global.enums.SeatStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "meeting_room")
@Getter
@NoArgsConstructor
public class MeetingRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    private String roomName;

    private int capacity;

    @Enumerated(EnumType.STRING)
    private SeatStatus status;

    private int hourlyRate;
    
    private String description;

    public void updateStatus(SeatStatus status){
        this.status = status;
    }
}
