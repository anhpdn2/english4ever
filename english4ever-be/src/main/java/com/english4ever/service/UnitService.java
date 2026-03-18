package com.english4ever.service;

import com.english4ever.dto.UnitRequest;
import com.english4ever.model.Unit;
import com.english4ever.repository.FlashcardRepository;
import com.english4ever.repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UnitService {

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private CourseService courseService;

    public List<Unit> getUnitsByCourseId(String courseId) {
        return unitRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    public Optional<Unit> getUnitById(String id) {
        return unitRepository.findById(id);
    }

    public Unit createUnit(UnitRequest request) {
        Unit unit = new Unit();
        unit.setCourseId(request.getCourseId());
        unit.setName(request.getName());
        unit.setDescription(request.getDescription());

        // Set order index
        if (request.getOrderIndex() != null) {
            unit.setOrderIndex(request.getOrderIndex());
        } else {
            // Auto-increment order index
            List<Unit> units = unitRepository.findByCourseIdOrderByOrderIndexAsc(request.getCourseId());
            unit.setOrderIndex(units.size());
        }

        unit.setCreatedAt(LocalDateTime.now());
        unit.setUpdatedAt(LocalDateTime.now());

        Unit savedUnit = unitRepository.save(unit);

        // Update course stats
        courseService.updateCourseStats(request.getCourseId());

        return savedUnit;
    }

    public Unit updateUnit(String id, UnitRequest request) {
        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found"));

        unit.setName(request.getName());
        unit.setDescription(request.getDescription());

        if (request.getOrderIndex() != null) {
            unit.setOrderIndex(request.getOrderIndex());
        }

        unit.setUpdatedAt(LocalDateTime.now());

        return unitRepository.save(unit);
    }

    public void deleteUnit(String id) {
        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found"));

        unitRepository.deleteById(id);

        // Update course stats
        courseService.updateCourseStats(unit.getCourseId());
    }

    public void updateUnitStats(String unitId) {
        Unit unit = unitRepository.findById(unitId)
                .orElseThrow(() -> new RuntimeException("Unit not found"));

        long flashcardCount = flashcardRepository.countByUnitId(unitId);
        unit.setTotalFlashcards((int) flashcardCount);
        unit.setUpdatedAt(LocalDateTime.now());

        unitRepository.save(unit);
    }
}
