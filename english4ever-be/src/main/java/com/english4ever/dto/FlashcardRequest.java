package com.english4ever.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Data
public class FlashcardRequest {

    @NotBlank(message = "Unit ID is required")
    private String unitId;

    @NotBlank(message = "Term is required")
    private String term;

    @NotBlank(message = "Definition is required")
    private String definition;

    private String pronunciation;

    private String audioUrl;

    private String imageUrl;

    private String partOfSpeech;

    private String exampleSentence;

    private List<String> distractors;

    private Integer orderIndex;
}
