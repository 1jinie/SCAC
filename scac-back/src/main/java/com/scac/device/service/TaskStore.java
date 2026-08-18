package com.scac.device.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

import com.scac.device.entity.TaskCommand;
import com.scac.global.exception.TaskNotFoundException;

@Service
public class TaskStore {
    private final AtomicLong sequence = new AtomicLong();
    private final ConcurrentHashMap<Long, TaskCommand> commands = new ConcurrentHashMap<>();

    // 작업 생성
    public TaskCommand create(String taskType, String payload) {
        long id = sequence.incrementAndGet();

        TaskCommand command = new TaskCommand(
            id, 
            taskType, 
            payload, 
            TaskCommand.Status.PENDING,
            null, 
            Instant.now(), 
            null);
        commands.put(id, command);
        return command;
    }

    // 가장 오래된 대기작업 1개
    public TaskCommand pending() {
        return commands.values().stream()
                .filter(c -> c.status() == TaskCommand.Status.PENDING)
                .sorted(Comparator.comparingLong(TaskCommand::id))
                .findFirst().orElse(null);
    }

    // 작업 조회
    public TaskCommand find(long id) {
        TaskCommand command = commands.get(id);
        if (command == null) throw new TaskNotFoundException(id);
        return command;
    }

    // 작업 완료
    public TaskCommand complete(long id, String result) {
        return commands.compute(id, (key, command) -> {
            if (command == null) throw new TaskNotFoundException(id);
            return command.complete(result, Instant.now());
        });
    }

    // 작업 실패
    public TaskCommand fail(long id, String result){
        return commands.compute(id, (key, command) -> {
            if(command == null) throw new TaskNotFoundException(id);
            return command.fail(result, Instant.now());
        });
    }
}

