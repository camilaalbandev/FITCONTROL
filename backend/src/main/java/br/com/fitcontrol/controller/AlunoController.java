package br.com.fitcontrol.controller;

import br.com.fitcontrol.model.Aluno;
import br.com.fitcontrol.model.Plano;
import br.com.fitcontrol.repository.AlunoRepository;
import br.com.fitcontrol.repository.PlanoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {
    private final AlunoRepository alunos;
    private final PlanoRepository planos;

    public AlunoController(AlunoRepository alunos, PlanoRepository planos) {
        this.alunos = alunos;
        this.planos = planos;
    }

    @GetMapping
    public List<Aluno> listar() { return alunos.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscar(@PathVariable Long id) {
        return alunos.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Aluno aluno) {
        if (aluno.getPlano() != null && aluno.getPlano().getId() != null) {
            Plano plano = planos.findById(aluno.getPlano().getId()).orElse(null);
            if (plano == null) return ResponseEntity.badRequest().body("Plano não encontrado.");
            aluno.setPlano(plano);
        }
        aluno.setId(null);
        return ResponseEntity.ok(alunos.save(aluno));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Aluno dados) {
        return alunos.findById(id).map(atual -> {
            atual.setNome(dados.getNome());
            atual.setCpf(dados.getCpf());
            atual.setTelefone(dados.getTelefone());
            atual.setIdade(dados.getIdade());
            atual.setEndereco(dados.getEndereco());
            atual.setDataMatricula(dados.getDataMatricula());
            atual.setStatus(dados.getStatus());
            if (dados.getPlano() != null && dados.getPlano().getId() != null) {
                Plano plano = planos.findById(dados.getPlano().getId()).orElse(null);
                if (plano == null) return ResponseEntity.badRequest().body("Plano não encontrado.");
                atual.setPlano(plano);
            } else atual.setPlano(null);
            return ResponseEntity.ok(alunos.save(atual));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!alunos.existsById(id)) return ResponseEntity.notFound().build();
        alunos.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
