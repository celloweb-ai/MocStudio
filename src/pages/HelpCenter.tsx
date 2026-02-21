import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  CircleHelp,
  FileText,
  LifeBuoy,
  Mail,
  MessageSquare,
  Search,
  ShieldCheck,
  TriangleAlert,
  Video,
  Workflow,
  Wrench,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Users,
  ClipboardCheck,
  Archive,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Language } from "@/i18n/translations";

type Bilingual = Record<Language, string>;

type HelpArticle = {
  id: string;
  title: Bilingual;
  summary: Bilingual;
  documentUrl: string;
  category: Bilingual;
  readTime: string;
};

type FaqItem = {
  id: string;
  question: Bilingual;
  answer: Bilingual;
  tag: string;
};

const quickStartGuides: HelpArticle[] = [
  {
    id: "setup-profile",
    title: { en: "Set up your MOC Studio profile", pt: "Configure seu perfil MOC Studio" },
    summary: { en: "Complete your profile, department, and notification settings before creating your first request.", pt: "Complete seu perfil, departamento e configurações de notificação antes de criar sua primeira solicitação." },
    documentUrl: "https://docs.company.com/moc-studio/setup-profile",
    category: { en: "Getting Started", pt: "Começando" },
    readTime: "4 min",
  },
  {
    id: "create-moc",
    title: { en: "Create and submit a new MOC request", pt: "Crie e envie uma nova solicitação MOC" },
    summary: { en: "Learn which fields are mandatory, how to classify risk, and how to attach supporting evidence.", pt: "Aprenda quais campos são obrigatórios, como classificar riscos e como anexar evidências." },
    documentUrl: "https://docs.company.com/moc-studio/create-moc-request",
    category: { en: "MOC Workflow", pt: "Fluxo MOC" },
    readTime: "7 min",
  },
  {
    id: "approval-flow",
    title: { en: "Understand approval routing", pt: "Entenda o roteamento de aprovação" },
    summary: { en: "See how reviewer assignment works across operations, engineering, HSE, and leadership.", pt: "Veja como a atribuição de revisores funciona entre operações, engenharia, HSE e liderança." },
    documentUrl: "https://docs.company.com/moc-studio/approval-routing",
    category: { en: "Compliance", pt: "Conformidade" },
    readTime: "5 min",
  },
  {
    id: "closeout",
    title: { en: "Close out tasks and archive evidence", pt: "Encerre tarefas e arquive evidências" },
    summary: { en: "Track all open actions, complete closeout validation, and store final documentation.", pt: "Acompanhe todas as ações abertas, complete a validação de encerramento e armazene a documentação final." },
    documentUrl: "https://docs.company.com/moc-studio/closeout-and-archive",
    category: { en: "MOC Workflow", pt: "Fluxo MOC" },
    readTime: "6 min",
  },
];

const faqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: { en: "Why can't I submit an MOC request?", pt: "Por que não consigo enviar uma solicitação MOC?" },
    answer: { en: "MOC requests cannot be submitted when mandatory fields are incomplete. Verify the scope, impact description, risk level, implementation date, and required attachments. If all fields are complete, check whether your account has submit permissions for your facility.", pt: "Solicitações MOC não podem ser enviadas quando campos obrigatórios estão incompletos. Verifique o escopo, descrição de impacto, nível de risco, data de implementação e anexos obrigatórios. Se todos os campos estiverem completos, verifique se sua conta tem permissões de envio para sua instalação." },
    tag: "Workflow",
  },
  {
    id: "faq-2",
    question: { en: "How are approvers selected?", pt: "Como os aprovadores são selecionados?" },
    answer: { en: "Approvers are assigned based on facility, change type, and risk category. The workflow usually includes Engineering, Operations, HSE, and final authority. User Management admins can update approver matrices.", pt: "Os aprovadores são atribuídos com base na instalação, tipo de mudança e categoria de risco. O fluxo geralmente inclui Engenharia, Operações, HSE e autoridade final. Administradores de Gestão de Usuários podem atualizar as matrizes de aprovadores." },
    tag: "Approvals",
  },
  {
    id: "faq-3",
    question: { en: "Can I reopen a closed request?", pt: "Posso reabrir uma solicitação encerrada?" },
    answer: { en: "Closed requests are audit records and cannot be directly edited. Create a follow-up MOC and reference the original request ID. Contact the compliance team if a closure correction is required.", pt: "Solicitações encerradas são registros de auditoria e não podem ser editadas diretamente. Crie uma MOC de acompanhamento e referencie o ID da solicitação original. Contate a equipe de conformidade se uma correção de encerramento for necessária." },
    tag: "Compliance",
  },
  {
    id: "faq-4",
    question: { en: "How do I reset my password or unlock my account?", pt: "Como redefinir minha senha ou desbloquear minha conta?" },
    answer: { en: "Use the Forgot Password flow from the sign-in page. For account lockouts caused by repeated failed attempts, request assistance from your administrator or support team.", pt: "Use o fluxo de Esqueceu a Senha na página de login. Para bloqueios de conta causados por tentativas repetidas, solicite assistência ao seu administrador ou equipe de suporte." },
    tag: "Access",
  },
  {
    id: "faq-5",
    question: { en: "Reports are missing recent updates. What should I do?", pt: "Os relatórios não mostram atualizações recentes. O que devo fazer?" },
    answer: { en: "Reports refresh automatically, but complex datasets may lag. Use filters to confirm date range and facility scope. If data is still outdated, trigger a refresh and notify support with the report name and time window.", pt: "Os relatórios atualizam automaticamente, mas conjuntos de dados complexos podem ter atraso. Use filtros para confirmar o período e escopo da instalação. Se os dados ainda estiverem desatualizados, atualize manualmente e notifique o suporte com o nome do relatório e período." },
    tag: "Reporting",
  },
  {
    id: "faq-6",
    question: { en: "What should I do if the system is slow?", pt: "O que devo fazer se o sistema estiver lento?" },
    answer: { en: "First, verify browser stability and network quality. Then reduce the active date range or number of report filters. Persistent slowness should be reported with screenshots, UTC timestamp, and module name.", pt: "Primeiro, verifique a estabilidade do navegador e a qualidade da rede. Depois, reduza o período ativo ou o número de filtros de relatório. Lentidão persistente deve ser reportada com capturas de tela, timestamp UTC e nome do módulo." },
    tag: "Technical",
  },
];

const glossaryData: { term: Bilingual; definition: Bilingual }[] = [
  {
    term: { en: "MOC", pt: "MOC" },
    definition: { en: "Management of Change process used to evaluate and control risk associated with operational changes.", pt: "Processo de Gestão de Mudanças usado para avaliar e controlar riscos associados a mudanças operacionais." },
  },
  {
    term: { en: "Risk Matrix", pt: "Matriz de Risco" },
    definition: { en: "Scoring framework to classify potential impact and likelihood for a proposed change.", pt: "Estrutura de pontuação para classificar impacto potencial e probabilidade de uma mudança proposta." },
  },
  {
    term: { en: "Closeout", pt: "Encerramento" },
    definition: { en: "Final verification stage confirming all actions are complete and documented before archival.", pt: "Etapa final de verificação confirmando que todas as ações estão concluídas e documentadas antes do arquivamento." },
  },
  {
    term: { en: "Approver Matrix", pt: "Matriz de Aprovadores" },
    definition: { en: "Configured rules that determine who must review and approve specific categories of changes.", pt: "Regras configuradas que determinam quem deve revisar e aprovar categorias específicas de mudanças." },
  },
];

const getEscalationChannels = (lang: Language) => [
  {
    title: lang === "pt" ? "Help Desk" : "Help Desk",
    detail: "moc-support@company.com",
    icon: Mail,
    eta: lang === "pt" ? "Resposta em 4 horas úteis" : "Response in 4 business hours",
  },
  {
    title: lang === "pt" ? "Suporte ao Vivo" : "Live Support",
    detail: "#moc-support in Teams",
    icon: MessageSquare,
    eta: lang === "pt" ? "Resposta em 30 minutos" : "Response in 30 minutes",
  },
  {
    title: lang === "pt" ? "Escalação de Emergência" : "Emergency Escalation",
    detail: lang === "pt" ? "Gerente de Plantão de Operações" : "Operations Duty Manager",
    icon: TriangleAlert,
    eta: lang === "pt" ? "Imediato para problemas críticos de produção" : "Immediate for production-critical issues",
  },
];

type WorkflowStage = {
  stage: Bilingual;
  icon: typeof FileText;
  description: Bilingual;
  actions: Bilingual[];
  tips: Bilingual[];
  status: string;
};

const workflowStages: WorkflowStage[] = [
  {
    stage: { en: "1. Draft Creation", pt: "1. Criação do Rascunho" },
    icon: FileText,
    description: { en: "Initiator creates MOC request with complete scope definition", pt: "O iniciador cria a solicitação MOC com definição completa do escopo" },
    actions: [
      { en: "Define change type (Equipment Modification, Replacement, Addition, Procedure Change, Software Change, Major Change)", pt: "Defina o tipo de mudança (Modificação de Equipamento, Substituição, Adição, Mudança de Procedimento, Mudança de Software, Mudança Maior)" },
      { en: "Describe proposed change in detail including what, where, when, why, and how", pt: "Descreva a mudança proposta em detalhes incluindo o quê, onde, quando, por quê e como" },
      { en: "Identify affected systems, equipment, and areas", pt: "Identifique sistemas, equipamentos e áreas afetados" },
      { en: "Attach supporting documentation (drawings, datasheets, calculations, photos)", pt: "Anexe documentação de suporte (desenhos, fichas técnicas, cálculos, fotos)" },
      { en: "Set priority level (Low, Medium, High, Critical)", pt: "Defina o nível de prioridade (Baixo, Médio, Alto, Crítico)" },
      { en: "Define if change is temporary or permanent and estimated duration", pt: "Defina se a mudança é temporária ou permanente e duração estimada" },
    ],
    tips: [
      { en: "Use clear, technical language avoiding ambiguity", pt: "Use linguagem clara e técnica evitando ambiguidades" },
      { en: "Reference existing equipment tags, P&IDs, and system numbers", pt: "Referencie tags de equipamentos existentes, P&IDs e números de sistemas" },
      { en: "Include 'before' photos or documentation of current state", pt: "Inclua fotos 'antes' ou documentação do estado atual" },
      { en: "Draft can be saved and edited multiple times before submission", pt: "O rascunho pode ser salvo e editado várias vezes antes do envio" },
    ],
    status: "Draft",
  },
  {
    stage: { en: "2. Risk Assessment", pt: "2. Avaliação de Risco" },
    icon: AlertCircle,
    description: { en: "Evaluate probability and severity to determine risk level", pt: "Avalie probabilidade e severidade para determinar o nível de risco" },
    actions: [
      { en: "Assess risk probability (1-5 scale: Very Low to Very High)", pt: "Avalie a probabilidade de risco (escala 1-5: Muito Baixo a Muito Alto)" },
      { en: "Assess risk severity/consequence (1-5 scale: Negligible to Catastrophic)", pt: "Avalie a severidade/consequência do risco (escala 1-5: Negligível a Catastrófico)" },
      { en: "Calculate risk rating (Probability × Severity)", pt: "Calcule a classificação de risco (Probabilidade × Severidade)" },
      { en: "Identify risk category (Low Risk: 1-6, Medium Risk: 7-15, High Risk: 16-25)", pt: "Identifique a categoria de risco (Baixo Risco: 1-6, Médio Risco: 7-15, Alto Risco: 16-25)" },
      { en: "Define mitigation measures to reduce residual risk", pt: "Defina medidas de mitigação para reduzir o risco residual" },
      { en: "Determine if HAZOP/HAZID study is required (typically for High Risk changes)", pt: "Determine se estudo HAZOP/HAZID é necessário (tipicamente para mudanças de Alto Risco)" },
    ],
    tips: [
      { en: "Consider HSE, operational, environmental, and financial impacts", pt: "Considere impactos de HSE, operacionais, ambientais e financeiros" },
      { en: "Review similar past incidents or near-misses", pt: "Revise incidentes passados similares ou quase-acidentes" },
      { en: "Consult risk matrix in Standards & Links section", pt: "Consulte a matriz de risco na seção Normas e Links" },
      { en: "Document assumptions made during risk assessment", pt: "Documente as premissas feitas durante a avaliação de risco" },
    ],
    status: "Draft",
  },
  {
    stage: { en: "3. Submission", pt: "3. Submissão" },
    icon: CheckCircle2,
    description: { en: "Complete all mandatory fields and submit for review", pt: "Complete todos os campos obrigatórios e envie para revisão" },
    actions: [
      { en: "Verify all mandatory fields are completed (title, description, justification, facility, change type, risk assessment)", pt: "Verifique se todos os campos obrigatórios estão completos (título, descrição, justificativa, instalação, tipo de mudança, avaliação de risco)" },
      { en: "Confirm target implementation date is realistic", pt: "Confirme se a data de implementação prevista é realista" },
      { en: "Review attached documentation for completeness", pt: "Revise a documentação anexada quanto à completude" },
      { en: "Set review deadline based on priority and complexity", pt: "Defina o prazo de revisão com base na prioridade e complexidade" },
      { en: "Submit request - status changes from Draft to Submitted", pt: "Envie a solicitação - o status muda de Rascunho para Submetido" },
      { en: "Automatic notifications sent to designated approvers", pt: "Notificações automáticas enviadas aos aprovadores designados" },
    ],
    tips: [
      { en: "Cannot edit most fields after submission - review carefully", pt: "Não é possível editar a maioria dos campos após o envio - revise com cuidado" },
      { en: "System automatically assigns approvers based on change type and risk level", pt: "O sistema atribui automaticamente aprovadores com base no tipo de mudança e nível de risco" },
      { en: "Urgent/critical changes may bypass standard timeline", pt: "Mudanças urgentes/críticas podem contornar o cronograma padrão" },
      { en: "You'll receive email confirmation upon successful submission", pt: "Você receberá confirmação por e-mail após envio bem-sucedido" },
    ],
    status: "Submitted",
  },
  {
    stage: { en: "4. Review Process", pt: "4. Processo de Revisão" },
    icon: Users,
    description: { en: "Multi-disciplinary review by assigned approvers", pt: "Revisão multidisciplinar pelos aprovadores designados" },
    actions: [
      { en: "Engineering review: technical feasibility, design integrity, equipment specifications", pt: "Revisão de Engenharia: viabilidade técnica, integridade do projeto, especificações de equipamentos" },
      { en: "Operations review: operational impact, execution plan, resource requirements", pt: "Revisão de Operações: impacto operacional, plano de execução, requisitos de recursos" },
      { en: "HSE review: safety implications, environmental impact, regulatory compliance", pt: "Revisão de HSE: implicações de segurança, impacto ambiental, conformidade regulatória" },
      { en: "Maintenance review: maintainability, spare parts, documentation updates", pt: "Revisão de Manutenção: manutenibilidade, peças de reposição, atualizações de documentação" },
      { en: "Management review: business justification, budget approval, strategic alignment", pt: "Revisão Gerencial: justificativa de negócios, aprovação de orçamento, alinhamento estratégico" },
    ],
    tips: [
      { en: "Reviewers can request additional information - respond promptly", pt: "Revisores podem solicitar informações adicionais - responda prontamente" },
      { en: "Changes may be returned to Draft status if major gaps identified", pt: "Mudanças podem retornar ao status de Rascunho se lacunas importantes forem identificadas" },
      { en: "Approval committee meetings typically held weekly for complex changes", pt: "Reuniões do comitê de aprovação geralmente realizadas semanalmente para mudanças complexas" },
      { en: "Track review status in MOC Detail page - real-time updates", pt: "Acompanhe o status da revisão na página de Detalhes MOC - atualizações em tempo real" },
      { en: "You can add comments and respond to reviewer questions", pt: "Você pode adicionar comentários e responder às perguntas dos revisores" },
    ],
    status: "Under Review",
  },
  {
    stage: { en: "5. Approval Decision", pt: "5. Decisão de Aprovação" },
    icon: CheckCircle2,
    description: { en: "Final approval or rejection with documented rationale", pt: "Aprovação final ou rejeição com justificativa documentada" },
    actions: [
      { en: "All required approvers provide decision: Approved, Rejected, or Changes Requested", pt: "Todos os aprovadores necessários fornecem decisão: Aprovado, Rejeitado ou Alterações Solicitadas" },
      { en: "Approved: MOC proceeds to implementation planning", pt: "Aprovado: MOC prossegue para planejamento de implementação" },
      { en: "Changes Requested: MOC returned to initiator for revision and resubmission", pt: "Alterações Solicitadas: MOC devolvida ao iniciador para revisão e reenvio" },
      { en: "Rejected: MOC closed with documented rejection reasons", pt: "Rejeitado: MOC encerrada com motivos de rejeição documentados" },
      { en: "Conditional approvals may include specific requirements or restrictions", pt: "Aprovações condicionais podem incluir requisitos ou restrições específicas" },
    ],
    tips: [
      { en: "Unanimous approval required from all assigned reviewers", pt: "Aprovação unânime necessária de todos os revisores designados" },
      { en: "Approval validity period typically 6-12 months depending on change type", pt: "Período de validade da aprovação tipicamente 6-12 meses dependendo do tipo de mudança" },
      { en: "Rejected MOCs can be appealed with additional justification", pt: "MOCs rejeitadas podem ser apeladas com justificativa adicional" },
      { en: "Approved MOCs generate implementation work orders automatically", pt: "MOCs aprovadas geram ordens de serviço de implementação automaticamente" },
    ],
    status: "Approved / Rejected",
  },
  {
    stage: { en: "6. Implementation", pt: "6. Implementação" },
    icon: Wrench,
    description: { en: "Execute approved change with proper controls", pt: "Execute a mudança aprovada com controles adequados" },
    actions: [
      { en: "Develop detailed implementation plan with step-by-step procedures", pt: "Desenvolva plano detalhado de implementação com procedimentos passo a passo" },
      { en: "Coordinate with operations for system isolation/shutdown if required", pt: "Coordene com operações para isolamento/desligamento do sistema se necessário" },
      { en: "Conduct pre-job safety briefing and obtain permits (Hot Work, Confined Space, etc.)", pt: "Realize briefing de segurança pré-trabalho e obtenha permissões (Trabalho a Quente, Espaço Confinado, etc.)" },
      { en: "Execute change per approved scope - no deviations without new MOC", pt: "Execute a mudança conforme escopo aprovado - sem desvios sem nova MOC" },
      { en: "Document 'as-built' conditions with photos and updated drawings", pt: "Documente as condições 'as-built' com fotos e desenhos atualizados" },
      { en: "Complete functional testing and performance verification", pt: "Complete testes funcionais e verificação de desempenho" },
    ],
    tips: [
      { en: "Implementation must occur within approved timeline", pt: "A implementação deve ocorrer dentro do cronograma aprovado" },
      { en: "Any scope changes require new MOC or MOC revision", pt: "Qualquer mudança de escopo requer nova MOC ou revisão de MOC" },
      { en: "Maintain communication log of key decisions and issues", pt: "Mantenha registro de comunicação de decisões e problemas-chave" },
      { en: "Update affected procedures, training materials, and drawings immediately", pt: "Atualize procedimentos, materiais de treinamento e desenhos afetados imediatamente" },
      { en: "Ensure spare parts and maintenance procedures are in place", pt: "Garanta que peças de reposição e procedimentos de manutenção estejam disponíveis" },
    ],
    status: "Implemented",
  },
  {
    stage: { en: "7. Closeout & Archive", pt: "7. Encerramento e Arquivamento" },
    icon: Archive,
    description: { en: "Verify completion and archive documentation", pt: "Verifique a conclusão e arquive a documentação" },
    actions: [
      { en: "Verify all action items from approval conditions are complete", pt: "Verifique se todas as ações das condições de aprovação estão concluídas" },
      { en: "Confirm updated documentation (P&IDs, procedures, training records) in document control", pt: "Confirme documentação atualizada (P&IDs, procedimentos, registros de treinamento) no controle de documentos" },
      { en: "Conduct post-implementation review meeting with stakeholders", pt: "Realize reunião de revisão pós-implementação com as partes interessadas" },
      { en: "Upload final 'as-built' documentation and commissioning records", pt: "Carregue documentação final 'as-built' e registros de comissionamento" },
      { en: "Complete lessons learned section for future reference", pt: "Complete a seção de lições aprendidas para referência futura" },
      { en: "Archive MOC with 'Implemented' status - becomes permanent record", pt: "Arquive MOC com status 'Implementado' - torna-se registro permanente" },
    ],
    tips: [
      { en: "Closeout typically required within 30 days of implementation", pt: "Encerramento tipicamente necessário dentro de 30 dias da implementação" },
      { en: "Incomplete closeout may prevent future MOC submissions", pt: "Encerramento incompleto pode impedir futuras submissões de MOC" },
      { en: "Archived MOCs are audit records and cannot be deleted", pt: "MOCs arquivadas são registros de auditoria e não podem ser excluídas" },
      { en: "Use Reports module to analyze MOC trends and performance metrics", pt: "Use o módulo de Relatórios para analisar tendências e métricas de desempenho de MOC" },
    ],
    status: "Implemented (Archived)",
  },
];

export default function HelpCenter() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [documentLinks, setDocumentLinks] = useState<Record<string, string>>(
    () =>
      quickStartGuides.reduce<Record<string, string>>((acc, guide) => {
        acc[guide.id] = guide.documentUrl;
        return acc;
      }, {})
  );

  const filteredArticles = useMemo(
    () =>
      quickStartGuides.filter((article) => {
        const searchable = `${article.title[language]} ${article.summary[language]} ${article.category[language]}`.toLowerCase();
        return searchable.includes(query.toLowerCase());
      }),
    [query, language]
  );

  const filteredFaqs = useMemo(
    () =>
      faqItems.filter((faq) => {
        const searchable = `${faq.question[language]} ${faq.answer[language]} ${faq.tag}`.toLowerCase();
        return searchable.includes(query.toLowerCase());
      }),
    [query, language]
  );

  const escalationChannels = useMemo(() => getEscalationChannels(language), [language]);

  const handleDocumentLinkChange = (guideId: string, value: string) => {
    setDocumentLinks((currentLinks) => ({
      ...currentLinks,
      [guideId]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-xl p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="gap-2">
              <LifeBuoy className="h-3.5 w-3.5" />
              {t("help.supportDoc")}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("help.helpCenterTitle")}</h1>
            <p className="text-muted-foreground max-w-2xl">{t("help.helpCenterDesc")}</p>
          </div>
          <div className="flex gap-3">
            <Button className="gradient-primary text-primary-foreground">
              <Video className="mr-2 h-4 w-4" />
              {t("help.watchTraining")}
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              {t("help.downloadHandbook")}
            </Button>
          </div>
        </div>

        <div className="relative mt-6 max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("help.searchHelp")}
            className="pl-9"
          />
        </div>
      </section>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview">{t("help.overviewTab")}</TabsTrigger>
          <TabsTrigger value="workflow">{t("help.workflowTab")}</TabsTrigger>
          <TabsTrigger value="resources">{t("help.resourcesTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Workflow className="h-5 w-5 text-primary" />
                  {t("help.workflowOnboarding")}
                </CardTitle>
                <CardDescription>{t("help.workflowOnboardingDesc")}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  {t("help.complianceReadiness")}
                </CardTitle>
                <CardDescription>{t("help.complianceDesc")}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="h-5 w-5 text-primary" />
                  {t("help.technicalSupport")}
                </CardTitle>
                <CardDescription>{t("help.technicalSupportDesc")}</CardDescription>
              </CardHeader>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {t("help.quickStartGuides")}
                </CardTitle>
                <CardDescription>{t("help.quickStartDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredArticles.map((guide) => (
                  <div key={guide.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{guide.title[language]}</h3>
                      <Badge variant="outline">{guide.readTime}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{guide.summary[language]}</p>
                    <div className="mt-3 space-y-3">
                      <Badge variant="secondary">{guide.category[language]}</Badge>
                      <div className="space-y-2">
                        <label htmlFor={`document-link-${guide.id}`} className="text-xs font-medium text-muted-foreground">
                          {t("help.documentLink")}
                        </label>
                        <Input
                          id={`document-link-${guide.id}`}
                          value={documentLinks[guide.id] ?? ""}
                          onChange={(event) => handleDocumentLinkChange(guide.id, event.target.value)}
                          placeholder="https://"
                        />
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          disabled={!documentLinks[guide.id]?.trim()}
                        >
                          <a
                            href={documentLinks[guide.id]?.trim() || "#"}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t("help.openDocument")}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredArticles.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t("help.noGuidesMatch")}</p>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CircleHelp className="h-5 w-5 text-primary" />
                  {t("help.glossary")}
                </CardTitle>
                <CardDescription>{t("help.glossaryDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {glossaryData.map((item) => (
                  <div key={item.term.en} className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold text-foreground">{item.term[language]}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.definition[language]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Workflow className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{t("help.workflowTitle")}</CardTitle>
                  <CardDescription className="text-base mt-1">{t("help.workflowSubtitle")}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {workflowStages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.stage.en} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{stage.stage[language]}</h3>
                          <p className="text-muted-foreground mt-1">{stage.description[language]}</p>
                          <Badge variant="secondary" className="mt-2">{stage.status}</Badge>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-4">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <ClipboardCheck className="h-4 w-4 text-primary" />
                            {t("help.keyActions")}
                          </h4>
                          <ul className="space-y-2">
                            {stage.actions.map((action, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span>{action[language]}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-lg border border-border bg-accent/50 p-4">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            {t("help.proTips")}
                          </h4>
                          <ul className="space-y-2">
                            {stage.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                <span>{tip[language]}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {index < workflowStages.length - 1 && (
                      <div className="ml-6 h-8 w-0.5 bg-gradient-to-b from-primary to-transparent" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <section className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>{t("help.faqTitle")}</CardTitle>
                <CardDescription>{t("help.faqDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">{faq.question[language]}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{faq.answer[language]}</p>
                          <Badge variant="outline">{faq.tag}</Badge>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                {filteredFaqs.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-3">{t("help.noFaqMatch")}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5 text-primary" />
                  {t("help.escalationChannels")}
                </CardTitle>
                <CardDescription>{t("help.escalationDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {escalationChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <div key={channel.title} className="rounded-lg border border-border p-4">
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        <Icon className="h-4 w-4 text-primary" />
                        {channel.title}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{channel.detail}</p>
                      <p className="text-xs text-muted-foreground mt-2">{channel.eta}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
