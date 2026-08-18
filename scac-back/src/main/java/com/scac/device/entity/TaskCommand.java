package com.scac.device.entity;

import java.time.Instant;

public record TaskCommand(
        long id, 
        String taskType, 
        String payload, 
        Status status,
        String result, 
        Instant requestedAt, 
        Instant completedAt
) {
    public TaskCommand complete(String result, Instant completedAt) {
        return new TaskCommand(
            id, 
            taskType, 
            payload, 
            Status.COMPLETED,
            result, 
            requestedAt, 
            completedAt);
    }

    public TaskCommand fail(String result, Instant completedAt){
        return new TaskCommand(
            id, 
            taskType, 
            payload, 
            Status.FAILED, 
            result, 
            requestedAt, 
            completedAt
        );
    }

    public enum Status { PENDING, COMPLETED, FAILED }
}

