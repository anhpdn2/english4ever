package com.english4ever.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "units")
public class Unit {

    @Id
    private String id;

    private String courseId;

    private String name;

    private String description;

    private int orderIndex; // For ordering units within a course

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private int totalFlashcards = 0;
}
