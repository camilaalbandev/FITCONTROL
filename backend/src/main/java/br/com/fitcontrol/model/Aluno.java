package br.com.fitcontrol.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "alunos")
public class Aluno extends Pessoa {
    private String endereco;
    private LocalDate dataMatricula;
    private String status = "ATIVO";
    @ManyToOne
    @JoinColumn(name = "plano_id")
    private Plano plano;

    @Override
    public String getTipo() { return "ALUNO"; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public LocalDate getDataMatricula() { return dataMatricula; }
    public void setDataMatricula(LocalDate dataMatricula) { this.dataMatricula = dataMatricula; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Plano getPlano() { return plano; }
    public void setPlano(Plano plano) { this.plano = plano; }
}
