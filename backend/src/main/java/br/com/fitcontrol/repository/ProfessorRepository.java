package br.com.fitcontrol.repository;

import br.com.fitcontrol.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {}
