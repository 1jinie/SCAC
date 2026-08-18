package com.scac.device.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.scac.device.dto.DeviceHealthRequest;
import com.scac.device.entity.TaskCommand;
import com.scac.device.service.TaskStore;
import com.scac.global.exception.TaskNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class TaskController {
    private static final Logger log = LoggerFactory.getLogger(TaskController.class);
    private final TaskStore store;

    public TaskController(TaskStore store) { 
        this.store = store; 
    }

    /**
     * React -> Spring
     * 
     * 새로운 장치 작업 생성
     */
    @PostMapping("/commands")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskCommand create(@Valid @RequestBody CreateRequest request) {

        TaskCommand command = store.create(request.taskType(), request.payload());
        
        log.info("[React -> Spring] Command created. id={}, taskType={}, payload={}",
            command.id(), command.taskType(), command.payload());
        return command;
    }

    /**
     * RTOS -> Spring
     * 
     * 처리해야 할 작업 1개 조회
     */
    @GetMapping("/commands/pending")
    public TaskCommand pending() {
        return store.pending(); 
    }

    /**
     * 작업 상세 조회
     */
    @GetMapping("/commands/{id}")
    public TaskCommand find(@PathVariable("id") long id) { return store.find(id); }

    /**
     * RTOS -> Spring
     * 
     * 작업 처리 완료/실패 보고
     */
    @PatchMapping("/commands/{id}/finish")
    public TaskCommand finish(@PathVariable("id") long id, @Valid @RequestBody CompleteRequest request) {
        TaskCommand command;

        if("COMPLETED".equalsIgnoreCase(request.status())){
            command = store.complete(id, request.result());
        } else if("FAILED".equalsIgnoreCase(request.status())){
            command = store.fail(id, request.result());
        } else{
            throw new IllegalArgumentException("지원하지 않는 작업 상태입니다: " + request.status());
        }

        log.info("[RTOS -> Spring] Command finished. id={}, status={}, result={}", 
        id, request.status(), request.result());
        
        return command;
    }

    /**
     * RTOS -> Spring
     * 
     * 장치 상태 보고
     */
    @PostMapping("/devices/health")
    public Map<String, Object> health(@RequestBody DeviceHealthRequest request) {
        log.info("[RTOS -> Spring] Health check. deviceId={}, status={}, door={}, printer={}",
            request.deviceId(),
            request.status(),
            request.door(),
            request.cardReader(),
            request.printer()
        );

        return Map.of(
            "success", true,
            "deviceId", request.deviceId(),
            "status", request.status(),
            "door", request.door(),
            "cardReader", request.cardReader(),
            "printer", request.printer()
        );
    }
    

    @ExceptionHandler(TaskNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> notFound(TaskNotFoundException exception) {
        return Map.of("message", exception.getMessage());
    }

    public record CreateRequest(@NotBlank String taskType, String payload) {}
    public record CompleteRequest(@NotBlank String status, @NotBlank String result) {}
}

