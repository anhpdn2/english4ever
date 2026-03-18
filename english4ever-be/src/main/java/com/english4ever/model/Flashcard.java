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
@Document(collection = "flashcards")
public class Flashcard {

    @Id
    private String id;

    private String unitId;

    private String term; // English word/phrase

    private String definition; // Vietnamese translation

    private String pronunciation; // IPA or phonetic spelling

    private String audioUrl; // URL to audio file

    private String imageUrl; // Optional image

    private String partOfSpeech; // noun, verb, adj, etc.

    private String exampleSentence; // Example usage

    private List<String> distractors; // Wrong answers for multiple choice (3-4 options)

    private int orderIndex; // For ordering flashcards within a unit

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
