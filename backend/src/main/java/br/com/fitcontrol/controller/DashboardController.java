package br.com.fitcontrol.controller;

import br.com.fitcontrol.repository.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final AlunoRepository alunos;
    private final ProfessorRepository professores;
    private final PlanoRepository planos;
    private final PagamentoRepository pagamentos;

    public DashboardController(AlunoRepository alunos, ProfessorRepository professores, PlanoRepository planos, PagamentoRepository pagamentos) {
        this.alunos = alunos; this.professores = professores; this.planos = planos; this.pagamentos = pagamentos;
    }

    @GetMapping
    public Map<String, Long> resumo() {
        long ativos = alunos.findAll().stream().filter(a -> "ATIVO".equalsIgnoreCase(a.getStatus())).count();
        long vencidos = pagamentos.findAll().stream().filter(p -> !"PAGO".equalsIgnoreCase(p.getStatus()) && p.getVencimento() != null && p.getVencimento().isBefore(LocalDate.now())).count();
        return Map.of("totalAlunos", alunos.count(), "alunosAtivos", ativos, "mensalidadesVencidas", vencidos,
                "totalProfessores", professores.count(), "totalPlanos", planos.count());
    }
}
