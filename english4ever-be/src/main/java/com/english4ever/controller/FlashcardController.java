package com.english4ever.controller;

import com.english4ever.dto.FlashcardRequest;
import com.english4ever.model.Flashcard;
import com.english4ever.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/flashcards")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @GetMapping("/unit/{unitId}")
    public ResponseEntity<List<Flashcard>> getFlashcardsByUnitId(@PathVariable String unitId) {
        List<Flashcard> flashcards = flashcardService.getFlashcardsByUnitId(unitId);
        return ResponseEntity.ok(flashcards);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flashcard> getFlashcardById(@PathVariable String id) {
        return flashcardService.getFlashcardById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Flashcard> createFlashcard(@Valid @RequestBody FlashcardRequest request) {
        Flashcard flashcard = flashcardService.createFlashcard(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(flashcard);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flashcard> updateFlashcard(@PathVariable String id,
                                                       @Valid @RequestBody FlashcardRequest request) {
        Flashcard flashcard = flashcardService.updateFlashcard(id, request);
        return ResponseEntity.ok(flashcard);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashcard(@PathVariable String id) {
        flashcardService.deleteFlashcard(id);
        return ResponseEntity.noContent().build();
    }
}
