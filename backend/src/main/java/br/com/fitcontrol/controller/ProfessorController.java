package br.com.fitcontrol.controller;

import br.com.fitcontrol.model.Professor;
import br.com.fitcontrol.repository.ProfessorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {
    private final ProfessorRepository repository;
    public ProfessorController(ProfessorRepository repository) { this.repository = repository; }
    @GetMapping public List<Professor> listar() { return repository.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Professor> buscar(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping public Professor criar(@RequestBody Professor professor) { professor.setId(null); return repository.save(professor); }
    @PutMapping("/{id}") public ResponseEntity<Professor> atualizar(@PathVariable Long id, @RequestBody Professor dados) {
        return repository.findById(id).map(atual -> {
            atual.setNome(dados.getNome()); atual.setCpf(dados.getCpf()); atual.setTelefone(dados.getTelefone());
            atual.setIdade(dados.getIdade()); atual.setCref(dados.getCref()); atual.setEspecialidade(dados.getEspecialidade());
            atual.setHorarioTrabalho(dados.getHorarioTrabalho()); return ResponseEntity.ok(repository.save(atual));
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id); return ResponseEntity.noContent().build();
    }
}
