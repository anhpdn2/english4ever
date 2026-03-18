package com.english4ever.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class UnitRequest {

    @NotBlank(message = "Course ID is required")
    private String courseId;

    @NotBlank(message = "Unit name is required")
    private String name;

    private String description;

    private Integer orderIndex;
}
