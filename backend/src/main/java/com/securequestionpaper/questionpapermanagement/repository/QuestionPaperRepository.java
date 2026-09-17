package com.securequestionpaper.questionpapermanagement.repository;

import com.securequestionpaper.questionpapermanagement.entity.QuestionPaper;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionPaperRepository extends JpaRepository<QuestionPaper, Long> {
}