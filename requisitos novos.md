Requisitos novos – Projeto Órion

(Foco: BMs, Templates, Controle de Risco e Backlog)

1️⃣ Prioridade Máxima: Eliminar Retrabalho

A campanha deve ser disparada uma única vez. O sistema deve automatizar tudo que acontecer durante o disparo. Não pode haver necessidade de:

Cancelar campanha manualmente;
Cruzar base com PROC V; Em caso de situação de queimar a linha ou template, a campanha precisa continuar disparando, com a troca automatica
Separar novamente base manualmente;
Reprocessar disparos;
Tudo que ocorrer no meio da execução deve ser tratado automaticamente.

2️⃣ Gestão de Templates por BM (Pool de Templates)

Cada BM:
Possui apenas uma linha (número);
Pode possuir múltiplos templates disponíveis;

Regras obrigatórias:
🔹 Troca automática de template
Se um template ficar RED:
O sistema deve automaticamente:
Retirar esse template do disparo.
Trocar para outro template disponível da mesma BM.
Continuar o disparo sem pausar a campanha.

Não pode:
Parar a campanha
Exigir decisão manual
Gerar reenvio manual posterior

3️⃣ Troca de BM (Backlog / Evolução)

Se ocorrer:
Queima de todos os templates
Ou comprometimento da linha (Yellow/Red)
Ou número da BM comprometido
Então:

Deve haver possibilidade futura de troca automática de BM.

4️⃣ Controle de Alertas da Meta (Risco de Banimento)
🔹 Não priorizar alerta de "Scan"

Meta pode aplicar restrições de scan automaticamente.

O foco deve ser:
🔹 Alertas de Spam

Se ocorrerem:

3 alertas de spam no mesmo dia na mesma BM
O sistema deve:

Cancelar imediatamente a campanha.
Congelar a BM por 7 dias.
Impedir novos disparos nesse período.
Permitir disparo por outra BM (nova fila).

5️⃣ Limite Percentual de Disparo por BM

Nunca disparar 100% da capacidade da BM.
O sistema deve permitir configurar:
Percentual máximo de uso da BM.
Exemplo:

BM suporta 10.000 disparos
Configurado para 40%
Sistema só pode disparar 4.000
Esse percentual:
Deve ser configurável.
Pode variar por BM.
Deve ser controlado pelo sistema (não manualmente).

6️⃣ Visualização Unificada

Ver todas as campanhas em uma única tela.
Não precisar trocar de ambiente.
Não precisar puxar relatórios externos.

Conseguir acompanhar:
Status de disparo
Templates
Alertas
Qualidade

7️⃣ Relatórios Analíticos

O sistema deve gerar:
Analítico completo de disparo.
Informações suficientes para gerar insights depois.
Não precisa gerar insight automático.
A área operacional trabalha o insight manualmente.

8️⃣ Sistema Genérico (Multi-Cliente)

O sistema:

Não pode ser exclusivo para Bellinati.
Deve ser genérico.
Deve atender qualquer cliente novo.
Customizações específicas devem ser tratadas separadamente.

9️⃣ Operação Exclusiva da Robbu

O sistema será usado apenas internamente.
Cliente não terá acesso.
Somente equipe Robbu operará disparos.

🔟 Backlog Mencionado Pela Isa

Troca automática de BM quando número queimar.
Gestão futura de múltiplas linhas por BM.
Evolução de controle de alertas.
Possível automação adicional de risco.