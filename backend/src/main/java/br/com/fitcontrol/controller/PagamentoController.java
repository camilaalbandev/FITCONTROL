package br.com.fitcontrol.controller;

import br.com.fitcontrol.model.Pagamento;
import br.com.fitcontrol.model.Aluno;
import br.com.fitcontrol.repository.PagamentoRepository;
import br.com.fitcontrol.repository.AlunoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {
    private final PagamentoRepository pagamentos;
    private final AlunoRepository alunos;
    public PagamentoController(PagamentoRepository pagamentos, AlunoRepository alunos) {
        this.pagamentos = pagamentos; this.alunos = alunos;
    }
    @GetMapping public List<Pagamento> listar() { return pagamentos.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Pagamento> buscar(@PathVariable Long id) {
        return pagamentos.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<?> criar(@RequestBody Pagamento pagamento) {
        if (pagamento.getAluno() == null || pagamento.getAluno().getId() == null) return ResponseEntity.badRequest().body("Informe o aluno.");
        Aluno aluno = alunos.findById(pagamento.getAluno().getId()).orElse(null);
        if (aluno == null) return ResponseEntity.badRequest().body("Aluno não encontrado.");
        pagamento.setId(null); pagamento.setAluno(aluno);
        return ResponseEntity.ok(pagamentos.save(pagamento));
    }
    @PutMapping("/{id}") public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Pagamento dados) {
        return pagamentos.findById(id).map(atual -> {
            atual.setValor(dados.getValor()); atual.setVencimento(dados.getVencimento()); atual.setStatus(dados.getStatus());
            if (dados.getAluno() != null && dados.getAluno().getId() != null) {
                Aluno aluno = alunos.findById(dados.getAluno().getId()).orElse(null);
                if (aluno == null) return ResponseEntity.badRequest().body("Aluno não encontrado.");
                atual.setAluno(aluno);
            }
            return ResponseEntity.ok(pagamentos.save(atual));
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!pagamentos.existsById(id)) return ResponseEntity.notFound().build();
        pagamentos.deleteById(id); return ResponseEntity.noContent().build();
    }
}
