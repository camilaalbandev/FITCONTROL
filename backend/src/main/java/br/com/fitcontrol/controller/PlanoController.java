package br.com.fitcontrol.controller;

import br.com.fitcontrol.model.Plano;
import br.com.fitcontrol.repository.PlanoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/planos")
public class PlanoController {
    private final PlanoRepository repository;
    public PlanoController(PlanoRepository repository) { this.repository = repository; }
    @GetMapping public List<Plano> listar() { return repository.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Plano> buscar(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping public Plano criar(@RequestBody Plano plano) { plano.setId(null); return repository.save(plano); }
    @PutMapping("/{id}") public ResponseEntity<Plano> atualizar(@PathVariable Long id, @RequestBody Plano dados) {
        return repository.findById(id).map(atual -> {
            atual.setNome(dados.getNome()); atual.setValor(dados.getValor()); atual.setDuracaoMeses(dados.getDuracaoMeses());
            return ResponseEntity.ok(repository.save(atual));
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id); return ResponseEntity.noContent().build();
    }
}
