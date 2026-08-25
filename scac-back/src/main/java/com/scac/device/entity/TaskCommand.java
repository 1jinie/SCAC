package com.scac.device.entity;

import java.time.Instant;

import com.scac.device.enums.CommandStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "task_command")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TaskCommand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commandId;

    private Long deviceId;
    private String taskType;
    private String payload;

    @Enumerated(EnumType.STRING)
    private CommandStatus status;

    private String result;
    private Instant requestedAt;
    private Instant completedAt;

    public TaskCommand(Long deviceId, String taskType, String payload) {
        this.deviceId = deviceId;
        this.taskType = taskType;
        this.payload = payload;
        this.status = CommandStatus.PENDING;
        this.result = null;
        this.requestedAt = Instant.now();
        this.completedAt = null;
    }

    public void process() {
        this.status = CommandStatus.PROCESSING;
    }

    //
    private void validateProcessing() {
        if (this.status != CommandStatus.PROCESSING) {
            throw new IllegalStateException("PROCESSING 상태의 작업만 완료 또는 실패 처리할 수 있습니다. 현재 상태: " + this.status);
        }
    }

    public void complete(String result) {
        validateProcessing();

        this.status = CommandStatus.COMPLETED;
        this.result = result;
        this.completedAt = Instant.now();
    }

    public void fail(String result) {
        validateProcessing();

        this.status = CommandStatus.FAILED;
        this.result = result;
        this.completedAt = Instant.now();
    }

}
