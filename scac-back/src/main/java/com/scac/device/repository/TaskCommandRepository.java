package com.scac.device.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scac.device.entity.TaskCommand;
import com.scac.device.enums.CommandStatus;

public interface TaskCommandRepository extends JpaRepository<TaskCommand, Long>{
    Optional<TaskCommand> findFirstByStatusOrderByCommandIdAsc(CommandStatus status);
    List<TaskCommand> findAllByStatusOrderByCommandIdAsc(CommandStatus status);
}
