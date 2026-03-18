package com.english4ever.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class CourseRequest {

    @NotBlank(message = "Course name is required")
    private String name;

    private String description;

    private String imageUrl;
}
