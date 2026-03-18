package com.english4ever.dto;

import com.english4ever.model.Flashcard;
import com.english4ever.model.UserProgress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningResponse {
    private Flashcard flashcard;
    private UserProgress progress;
}
