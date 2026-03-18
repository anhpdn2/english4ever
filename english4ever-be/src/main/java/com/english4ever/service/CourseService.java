package com.english4ever.service;

import com.english4ever.dto.CourseRequest;
import com.english4ever.model.Course;
import com.english4ever.repository.CourseRepository;
import com.english4ever.repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UnitRepository unitRepository;

    public List<Course> getAllPublicCourses() {
        return courseRepository.findByIsPublicTrue();
    }

    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public Course createCourse(CourseRequest request) {
        Course course = new Course();
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setImageUrl(request.getImageUrl());
        course.setPublic(true);
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course updateCourse(String id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setImageUrl(request.getImageUrl());
        course.setUpdatedAt(LocalDateTime.now());

        return courseRepository.save(course);
    }

    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }

    public void updateCourseStats(String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        long unitCount = unitRepository.findByCourseIdOrderByOrderIndexAsc(courseId).size();
        course.setTotalUnits((int) unitCount);
        course.setUpdatedAt(LocalDateTime.now());

        courseRepository.save(course);
    }
}
