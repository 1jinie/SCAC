package com.scac.device.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scac.device.entity.TaskCommand;
import com.scac.device.enums.CommandStatus;
import com.scac.device.repository.TaskCommandRepository;
import com.scac.global.exception.TaskNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskStore {

    private final TaskCommandRepository taskCommandRepository;

    // 작업 생성
    @Transactional
    public TaskCommand create(Long deviceId, String taskType, String payload) {
        TaskCommand command = new TaskCommand(deviceId, taskType, payload);

        return taskCommandRepository.save(command);
    }

    // 작업 조회
    @Transactional(readOnly = true)
    public TaskCommand find(long id) {
        return taskCommandRepository.findById(id)
        .orElseThrow(() -> new TaskNotFoundException(id));
    }
    
    // 가장 오래된 대기작업 1개
    @Transactional
    public TaskCommand pending() {
        TaskCommand command = taskCommandRepository.findFirstByStatusOrderByCommandIdAsc(
            CommandStatus.PENDING).orElse(null);

        if(command == null) return null;

        command.process();

        return command;
    }
    
    // 작업 완료
    @Transactional
    public TaskCommand complete(long id, String result) {
        TaskCommand command = find(id);

        command.complete(result);

        return command;
    }

    // 작업 실패
    @Transactional
    public TaskCommand fail(long id, String result){
        TaskCommand command = find(id);

        command.fail(result);

        return command;
    }

    // 특정 상태 작업 조회
    @Transactional(readOnly = true)
    public List<TaskCommand> findByStatus(CommandStatus status){
        return taskCommandRepository.findAllByStatusOrderByCommandIdAsc(status);
    }
}

