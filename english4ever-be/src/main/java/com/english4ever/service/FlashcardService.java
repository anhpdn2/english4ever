package com.english4ever.service;

import com.english4ever.dto.FlashcardRequest;
import com.english4ever.model.Flashcard;
import com.english4ever.repository.FlashcardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private UnitService unitService;

    public List<Flashcard> getFlashcardsByUnitId(String unitId) {
        return flashcardRepository.findByUnitIdOrderByOrderIndexAsc(unitId);
    }

    public Optional<Flashcard> getFlashcardById(String id) {
        return flashcardRepository.findById(id);
    }

    public Flashcard createFlashcard(FlashcardRequest request) {
        Flashcard flashcard = new Flashcard();
        flashcard.setUnitId(request.getUnitId());
        flashcard.setTerm(request.getTerm());
        flashcard.setDefinition(request.getDefinition());
        flashcard.setPronunciation(request.getPronunciation());
        flashcard.setAudioUrl(request.getAudioUrl());
        flashcard.setImageUrl(request.getImageUrl());
        flashcard.setPartOfSpeech(request.getPartOfSpeech());
        flashcard.setExampleSentence(request.getExampleSentence());
        flashcard.setDistractors(request.getDistractors());

        // Set order index
        if (request.getOrderIndex() != null) {
            flashcard.setOrderIndex(request.getOrderIndex());
        } else {
            // Auto-increment order index
            List<Flashcard> flashcards = flashcardRepository.findByUnitIdOrderByOrderIndexAsc(request.getUnitId());
            flashcard.setOrderIndex(flashcards.size());
        }

        flashcard.setCreatedAt(LocalDateTime.now());
        flashcard.setUpdatedAt(LocalDateTime.now());

        Flashcard savedFlashcard = flashcardRepository.save(flashcard);

        // Update unit stats
        unitService.updateUnitStats(request.getUnitId());

        return savedFlashcard;
    }

    public Flashcard updateFlashcard(String id, FlashcardRequest request) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));

        flashcard.setTerm(request.getTerm());
        flashcard.setDefinition(request.getDefinition());
        flashcard.setPronunciation(request.getPronunciation());
        flashcard.setAudioUrl(request.getAudioUrl());
        flashcard.setImageUrl(request.getImageUrl());
        flashcard.setPartOfSpeech(request.getPartOfSpeech());
        flashcard.setExampleSentence(request.getExampleSentence());
        flashcard.setDistractors(request.getDistractors());

        if (request.getOrderIndex() != null) {
            flashcard.setOrderIndex(request.getOrderIndex());
        }

        flashcard.setUpdatedAt(LocalDateTime.now());

        return flashcardRepository.save(flashcard);
    }

    public void deleteFlashcard(String id) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));

        flashcardRepository.deleteById(id);

        // Update unit stats
        unitService.updateUnitStats(flashcard.getUnitId());
    }
}
