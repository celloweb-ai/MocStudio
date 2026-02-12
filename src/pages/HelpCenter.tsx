import { useMemo, useState } from "react";
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

type HelpArticle = {
  id: string;
  title: string;
  summary: string;
  documentUrl: string;
  category: "Getting Started" | "MOC Workflow" | "Compliance" | "Troubleshooting";
  readTime: string;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  tag: "Access" | "Workflow" | "Approvals" | "Reporting" | "Technical" | "Compliance";
};

const quickStartGuides: HelpArticle[] = [
  {
    id: "setup-profile",
    title: "Set up your MOC Studio profile",
    summary: "Complete your profile, department, and notification settings before creating your first request.",
    documentUrl: "https://docs.company.com/moc-studio/setup-profile",
    category: "Getting Started",
    readTime: "4 min",
  },
  {
    id: "create-moc",
    title: "Create and submit a new MOC request",
    summary: "Learn which fields are mandatory, how to classify risk, and how to attach supporting evidence.",
    documentUrl: "https://docs.company.com/moc-studio/create-moc-request",
    category: "MOC Workflow",
    readTime: "7 min",
  },
  {
    id: "approval-flow",
    title: "Understand approval routing",
    summary: "See how reviewer assignment works across operations, engineering, HSE, and leadership.",
    documentUrl: "https://docs.company.com/moc-studio/approval-routing",
    category: "Compliance",
    readTime: "5 min",
  },
  {
    id: "closeout",
    title: "Close out tasks and archive evidence",
    summary: "Track all open actions, complete closeout validation, and store final documentation.",
    documentUrl: "https://docs.company.com/moc-studio/closeout-and-archive",
    category: "MOC Workflow",
    readTime: "6 min",
  },
];

const faqItems: FaqItem[] = [
  {
    id: "faq-1",
    question: "Why can't I submit an MOC request?",
    answer:
      "MOC requests cannot be submitted when mandatory fields are incomplete. Verify the scope, impact description, risk level, implementation date, and required attachments. If all fields are complete, check whether your account has submit permissions for your facility.",
    tag: "Workflow",
  },
  {
    id: "faq-2",
    question: "How are approvers selected?",
    answer:
      "Approvers are assigned based on facility, change type, and risk category. The workflow usually includes Engineering, Operations, HSE, and final authority. User Management admins can update approver matrices.",
    tag: "Approvals",
  },
  {
    id: "faq-3",
    question: "Can I reopen a closed request?",
    answer:
      "Closed requests are audit records and cannot be directly edited. Create a follow-up MOC and reference the original request ID. Contact the compliance team if a closure correction is required.",
    tag: "Compliance",
  },
  {
    id: "faq-4",
    question: "How do I reset my password or unlock my account?",
    answer:
      "Use the Forgot Password flow from the sign-in page. For account lockouts caused by repeated failed attempts, request assistance from your administrator or support team.",
    tag: "Access",
  },
  {
    id: "faq-5",
    question: "Reports are missing recent updates. What should I do?",
    answer:
      "Reports refresh automatically, but complex datasets may lag. Use filters to confirm date range and facility scope. If data is still outdated, trigger a refresh and notify support with the report name and time window.",
    tag: "Reporting",
  },
  {
    id: "faq-6",
    question: "What should I do if the system is slow?",
    answer:
      "First, verify browser stability and network quality. Then reduce the active date range or number of report filters. Persistent slowness should be reported with screenshots, UTC timestamp, and module name.",
    tag: "Technical",
  },
];

const glossary = [
  {
    term: "MOC",
    definition: "Management of Change process used to evaluate and control risk associated with operational changes.",
  },
  {
    term: "Risk Matrix",
    definition: "Scoring framework to classify potential impact and likelihood for a proposed change.",
  },
  {
    term: "Closeout",
    definition: "Final verification stage confirming all actions are complete and documented before archival.",
  },
  {
    term: "Approver Matrix",
    definition: "Configured rules that determine who must review and approve specific categories of changes.",
  },
];

const escalationChannels = [
  {
    title: "Help Desk",
    detail: "moc-support@company.com",
    icon: Mail,
    eta: "Response in 4 business hours",
  },
  {
    title: "Live Support",
    detail: "#moc-support in Teams",
    icon: MessageSquare,
    eta: "Response in 30 minutes",
  },
  {
    title: "Emergency Escalation",
    detail: "Operations Duty Manager",
    icon: TriangleAlert,
    eta: "Immediate for production-critical issues",
  },
];

const workflowStages = [
  {
    stage: "1. Draft Creation",
    icon: FileText,
    description: "Initiator creates MOC request with complete scope definition",
    actions: [
      "Define change type (Equipment Modification, Replacement, Addition, Procedure Change, Software Change, Major Change)",
      "Describe proposed change in detail including what, where, when, why, and how",
      "Identify affected systems, equipment, and areas",
      "Attach supporting documentation (drawings, datasheets, calculations, photos)",
      "Set priority level (Low, Medium, High, Critical)",
      "Define if change is temporary or permanent and estimated duration",
    ],
    tips: [
      "Use clear, technical language avoiding ambiguity",
      "Reference existing equipment tags, P&IDs, and system numbers",
      "Include 'before' photos or documentation of current state",
      "Draft can be saved and edited multiple times before submission",
    ],
    status: "Draft",
  },
  {
    stage: "2. Risk Assessment",
    icon: AlertCircle,
    description: "Evaluate probability and severity to determine risk level",
    actions: [
      "Assess risk probability (1-5 scale: Very Low to Very High)",
      "Assess risk severity/consequence (1-5 scale: Negligible to Catastrophic)",
      "Calculate risk rating (Probability × Severity)",
      "Identify risk category (Low Risk: 1-6, Medium Risk: 7-15, High Risk: 16-25)",
      "Define mitigation measures to reduce residual risk",
      "Determine if HAZOP/HAZID study is required (typically for High Risk changes)",
    ],
    tips: [
      "Consider HSE, operational, environmental, and financial impacts",
      "Review similar past incidents or near-misses",
      "Consult risk matrix in Standards & Links section",
      "Document assumptions made during risk assessment",
    ],
    status: "Draft",
  },
  {
    stage: "3. Submission",
    icon: CheckCircle2,
    description: "Complete all mandatory fields and submit for review",
    actions: [
      "Verify all mandatory fields are completed (title, description, justification, facility, change type, risk assessment)",
      "Confirm target implementation date is realistic",
      "Review attached documentation for completeness",
      "Set review deadline based on priority and complexity",
      "Submit request - status changes from Draft to Submitted",
      "Automatic notifications sent to designated approvers",
    ],
    tips: [
      "Cannot edit most fields after submission - review carefully",
      "System automatically assigns approvers based on change type and risk level",
      "Urgent/critical changes may bypass standard timeline",
      "You'll receive email confirmation upon successful submission",
    ],
    status: "Submitted",
  },
  {
    stage: "4. Review Process",
    icon: Users,
    description: "Multi-disciplinary review by assigned approvers",
    actions: [
      "Engineering review: technical feasibility, design integrity, equipment specifications",
      "Operations review: operational impact, execution plan, resource requirements",
      "HSE review: safety implications, environmental impact, regulatory compliance",
      "Maintenance review: maintainability, spare parts, documentation updates",
      "Management review: business justification, budget approval, strategic alignment",
    ],
    tips: [
      "Reviewers can request additional information - respond promptly",
      "Changes may be returned to Draft status if major gaps identified",
      "Approval committee meetings typically held weekly for complex changes",
      "Track review status in MOC Detail page - real-time updates",
      "You can add comments and respond to reviewer questions",
    ],
    status: "Under Review",
  },
  {
    stage: "5. Approval Decision",
    icon: CheckCircle2,
    description: "Final approval or rejection with documented rationale",
    actions: [
      "All required approvers provide decision: Approved, Rejected, or Changes Requested",
      "Approved: MOC proceeds to implementation planning",
      "Changes Requested: MOC returned to initiator for revision and resubmission",
      "Rejected: MOC closed with documented rejection reasons",
      "Conditional approvals may include specific requirements or restrictions",
    ],
    tips: [
      "Unanimous approval required from all assigned reviewers",
      "Approval validity period typically 6-12 months depending on change type",
      "Rejected MOCs can be appealed with additional justification",
      "Approved MOCs generate implementation work orders automatically",
    ],
    status: "Approved / Rejected",
  },
  {
    stage: "6. Implementation",
    icon: Wrench,
    description: "Execute approved change with proper controls",
    actions: [
      "Develop detailed implementation plan with step-by-step procedures",
      "Coordinate with operations for system isolation/shutdown if required",
      "Conduct pre-job safety briefing and obtain permits (Hot Work, Confined Space, etc.)",
      "Execute change per approved scope - no deviations without new MOC",
      "Document 'as-built' conditions with photos and updated drawings",
      "Complete functional testing and performance verification",
    ],
    tips: [
      "Implementation must occur within approved timeline",
      "Any scope changes require new MOC or MOC revision",
      "Maintain communication log of key decisions and issues",
      "Update affected procedures, training materials, and drawings immediately",
      "Ensure spare parts and maintenance procedures are in place",
    ],
    status: "Implemented",
  },
  {
    stage: "7. Closeout & Archive",
    icon: Archive,
    description: "Verify completion and archive documentation",
    actions: [
      "Verify all action items from approval conditions are complete",
      "Confirm updated documentation (P&IDs, procedures, training records) in document control",
      "Conduct post-implementation review meeting with stakeholders",
      "Upload final 'as-built' documentation and commissioning records",
      "Complete lessons learned section for future reference",
      "Archive MOC with 'Implemented' status - becomes permanent record",
    ],
    tips: [
      "Closeout typically required within 30 days of implementation",
      "Incomplete closeout may prevent future MOC submissions",
      "Archived MOCs are audit records and cannot be deleted",
      "Use Reports module to analyze MOC trends and performance metrics",
    ],
    status: "Implemented (Archived)",
  },
];

export default function HelpCenter() {
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
        const searchable = `${article.title} ${article.summary} ${article.category}`.toLowerCase();
        return searchable.includes(query.toLowerCase());
      }),
    [query]
  );

  const filteredFaqs = useMemo(
    () =>
      faqItems.filter((faq) => {
        const searchable = `${faq.question} ${faq.answer} ${faq.tag}`.toLowerCase();
        return searchable.includes(query.toLowerCase());
      }),
    [query]
  );

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
              Support & Documentation
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">MOC Studio Help Center</h1>
            <p className="text-muted-foreground max-w-2xl">
              Everything you need to onboard users, execute compliant workflows, troubleshoot issues,
              and get fast support.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="gradient-primary text-primary-foreground">
              <Video className="mr-2 h-4 w-4" />
              Watch training
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Download handbook
            </Button>
          </div>
        </div>

        <div className="relative mt-6 max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guides, FAQs, and troubleshooting"
            className="pl-9"
          />
        </div>
      </section>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Onboarding</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Workflow className="h-5 w-5 text-primary" />
                  Workflow onboarding
                </CardTitle>
                <CardDescription>Step-by-step process from draft to closeout.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Compliance readiness
                </CardTitle>
                <CardDescription>Understand approvals, audits, and required evidence.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="h-5 w-5 text-primary" />
                  Technical support
                </CardTitle>
                <CardDescription>Resolve login, performance, and reporting issues quickly.</CardDescription>
              </CardHeader>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Quick start guides
                </CardTitle>
                <CardDescription>Essential reading for requestors, reviewers, and administrators.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredArticles.map((guide) => (
                  <div key={guide.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{guide.title}</h3>
                      <Badge variant="outline">{guide.readTime}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{guide.summary}</p>
                    <div className="mt-3 space-y-3">
                      <Badge variant="secondary">{guide.category}</Badge>
                      <div className="space-y-2">
                        <label htmlFor={`document-link-${guide.id}`} className="text-xs font-medium text-muted-foreground">
                          Link do documento
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
                            Abrir documento
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredArticles.length === 0 && (
                  <p className="text-sm text-muted-foreground">No guides match your search.</p>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CircleHelp className="h-5 w-5 text-primary" />
                  Glossary
                </CardTitle>
                <CardDescription>Common MOC terms and definitions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {glossary.map((item) => (
                  <div key={item.term} className="rounded-lg border border-border p-4">
                    <h3 className="font-semibold text-foreground">{item.term}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.definition}</p>
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
                  <CardTitle className="text-2xl">MOC Workflow: From Draft to Closeout</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Complete guide to the 7-stage Management of Change process
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {workflowStages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.stage} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{stage.stage}</h3>
                          <p className="text-muted-foreground mt-1">{stage.description}</p>
                          <Badge variant="secondary" className="mt-2">{stage.status}</Badge>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-4">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <ClipboardCheck className="h-4 w-4 text-primary" />
                            Key Actions
                          </h4>
                          <ul className="space-y-2">
                            {stage.actions.map((action, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-lg border border-border bg-accent/50 p-4">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            Pro Tips
                          </h4>
                          <ul className="space-y-2">
                            {stage.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                <span>{tip}</span>
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
                <CardTitle>Frequently asked questions</CardTitle>
                <CardDescription>Answers for common user and admin issues.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                          <Badge variant="outline">{faq.tag}</Badge>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                {filteredFaqs.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-3">No FAQs match your search.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5 text-primary" />
                  Escalation channels
                </CardTitle>
                <CardDescription>Contact the right team for each severity level.</CardDescription>
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
