package com.english4ever.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class AnswerRequest {

    @NotBlank(message = "Flashcard ID is required")
    private String flashcardId;

    @NotNull(message = "Correct flag is required")
    private Boolean correct;
}
