package com.scac.global.exception;

public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(long id) { super("task command not found: " + id); }
}

