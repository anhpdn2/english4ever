package com.english4ever.controller;

import com.english4ever.dto.UnitRequest;
import com.english4ever.model.Unit;
import com.english4ever.service.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/units")
public class UnitController {

    @Autowired
    private UnitService unitService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Unit>> getUnitsByCourseId(@PathVariable String courseId) {
        List<Unit> units = unitService.getUnitsByCourseId(courseId);
        return ResponseEntity.ok(units);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Unit> getUnitById(@PathVariable String id) {
        return unitService.getUnitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Unit> createUnit(@Valid @RequestBody UnitRequest request) {
        Unit unit = unitService.createUnit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(unit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Unit> updateUnit(@PathVariable String id,
                                            @Valid @RequestBody UnitRequest request) {
        Unit unit = unitService.updateUnit(id, request);
        return ResponseEntity.ok(unit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUnit(@PathVariable String id) {
        unitService.deleteUnit(id);
        return ResponseEntity.noContent().build();
    }
}
