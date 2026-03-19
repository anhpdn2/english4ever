package com.english4ever.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "courses")
public class Course {

    @Id
    private String id;

    private String name;

    private String description;

    private String imageUrl;

    private String color; // Color for course cover (e.g., "bg-blue-500")

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private boolean isPublic = true; // All courses are public for all users

    private int totalUnits = 0;

    private int totalFlashcards = 0;
}
