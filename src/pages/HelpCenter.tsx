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
} from "lucide-react";

type HelpArticle = {
  id: string;
  title: string;
  summary: string;
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
    category: "Getting Started",
    readTime: "4 min",
  },
  {
    id: "create-moc",
    title: "Create and submit a new MOC request",
    summary: "Learn which fields are mandatory, how to classify risk, and how to attach supporting evidence.",
    category: "MOC Workflow",
    readTime: "7 min",
  },
  {
    id: "approval-flow",
    title: "Understand approval routing",
    summary: "See how reviewer assignment works across operations, engineering, HSE, and leadership.",
    category: "Compliance",
    readTime: "5 min",
  },
  {
    id: "closeout",
    title: "Close out tasks and archive evidence",
    summary: "Track all open actions, complete closeout validation, and store final documentation.",
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

export default function HelpCenter() {
  const [query, setQuery] = useState("");

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
                <div className="mt-3">
                  <Badge variant="secondary">{guide.category}</Badge>
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
    </div>
  );
}
