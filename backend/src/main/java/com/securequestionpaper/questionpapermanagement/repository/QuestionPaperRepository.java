
package com.securequestionpaper.questionpapermanagement.repository;

import com.securequestionpaper.questionpapermanagement.entity.QuestionPaper;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionPaperRepository extends JpaRepository<QuestionPaper, Long> {

    List<QuestionPaper> findByStatus(String status);

}

