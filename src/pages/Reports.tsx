import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  PieChart,
  FileDown,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportsData, DateRange } from "@/hooks/useReportsData";
import { downloadCSV, generateMOCExportData } from "@/hooks/useMOCReporting";
import { ReportsTrendChart } from "@/components/reports/ReportsTrendChart";
import { ReportsStatusChart } from "@/components/reports/ReportsStatusChart";
import { ReportsPriorityChart } from "@/components/reports/ReportsPriorityChart";
import { ReportsFacilityChart } from "@/components/reports/ReportsFacilityChart";
import { ReportsApprovalTimeChart } from "@/components/reports/ReportsApprovalTimeChart";
import { ReportsTaskChart } from "@/components/reports/ReportsTaskChart";
import { ReportsSummaryCards } from "@/components/reports/ReportsSummaryCards";
import { toast } from "@/hooks/use-toast";

type PresetRange = "7d" | "30d" | "90d" | "6m" | "1y" | "custom";

const presetRanges: { value: PresetRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
  { value: "custom", label: "Custom range" },
];

function getPresetDateRange(preset: PresetRange): DateRange {
  const now = new Date();
  switch (preset) {
    case "7d":
      return { from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), to: now };
    case "30d":
      return { from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), to: now };
    case "90d":
      return { from: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), to: now };
    case "6m":
      return { from: startOfMonth(subMonths(now, 6)), to: endOfMonth(now) };
    case "1y":
      return { from: startOfMonth(subMonths(now, 12)), to: endOfMonth(now) };
    default:
      return { from: startOfMonth(subMonths(now, 6)), to: endOfMonth(now) };
  }
}

export default function Reports() {
  const [preset, setPreset] = useState<PresetRange>("6m");
  const [dateRange, setDateRange] = useState<DateRange>(getPresetDateRange("6m"));
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const {
    mocData,
    summary,
    avgApprovalTime,
    trendData,
    statusDistribution,
    priorityDistribution,
    changeTypeDistribution,
    facilityDistribution,
    approvalTimeTrend,
    taskStatusDistribution,
    isLoading,
  } = useReportsData(dateRange);

  const handlePresetChange = (value: PresetRange) => {
    setPreset(value);
    if (value !== "custom") {
      setDateRange(getPresetDateRange(value));
    }
  };

  const handleExportCSV = () => {
    if (!mocData || mocData.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no MOC requests in the selected date range.",
        variant: "destructive",
      });
      return;
    }

    const { headers, rows } = generateMOCExportData(mocData);
    const filename = `moc-report-${format(dateRange.from, "yyyy-MM-dd")}-to-${format(dateRange.to, "yyyy-MM-dd")}.csv`;
    downloadCSV(headers, rows, filename);
    
    toast({
      title: "Export Complete",
      description: `Exported ${mocData.length} MOC requests to CSV.`,
    });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      // Dynamic import of html2canvas and jspdf for PDF generation
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = jsPDFModule;

      if (!reportRef.current) {
        throw new Error("Report container not found");
      }

      // Create canvas from the report content
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#0f172a",
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      // Add title
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.text("MOC Analytics Report", pdfWidth / 2, 15, { align: "center" });
      
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Period: ${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`,
        pdfWidth / 2,
        22,
        { align: "center" }
      );

      // Calculate if we need multiple pages
      const contentHeight = imgHeight * ratio;
      const availableHeight = pdfHeight - 30;
      
      if (contentHeight <= availableHeight) {
        pdf.addImage(imgData, "PNG", imgX, 30, imgWidth * ratio, imgHeight * ratio);
      } else {
        // Split across multiple pages
        let position = 30;
        let remainingHeight = contentHeight;
        
        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", imgX, position - (contentHeight - remainingHeight), imgWidth * ratio, imgHeight * ratio);
          remainingHeight -= availableHeight;
          
          if (remainingHeight > 0) {
            pdf.addPage();
            position = 10;
          }
        }
      }

      // Save the PDF
      const filename = `moc-report-${format(dateRange.from, "yyyy-MM-dd")}-to-${format(dateRange.to, "yyyy-MM-dd")}.pdf`;
      pdf.save(filename);

      toast({
        title: "PDF Export Complete",
        description: "Your report has been downloaded.",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive MOC performance metrics and insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Selector */}
          <Select value={preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {presetRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {preset === "custom" && (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {format(dateRange.from, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">to</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {format(dateRange.to, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Export Buttons */}
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="default" size="sm" onClick={handleExportPDF} disabled={isLoading || isExporting}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4 mr-2" />
            )}
            PDF
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-6">
        {/* Summary Cards */}
        <ReportsSummaryCards 
          summary={summary} 
          avgApprovalTime={avgApprovalTime} 
          isLoading={isLoading} 
        />

        {/* Tabs for different report views */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ReportsTrendChart data={trendData} isLoading={isLoading} />
              <ReportsStatusChart data={statusDistribution} isLoading={isLoading} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <ReportsPriorityChart data={priorityDistribution} isLoading={isLoading} />
              <ReportsFacilityChart data={facilityDistribution} isLoading={isLoading} />
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ReportsStatusChart data={statusDistribution} isLoading={isLoading} title="MOC Status Distribution" />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Change Type Distribution
                  </CardTitle>
                  <CardDescription>MOCs by type of change</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : changeTypeDistribution.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No change type data available
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {changeTypeDistribution.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                            />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <ReportsTrendChart data={trendData} isLoading={isLoading} title="Monthly Status Trends" />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ReportsApprovalTimeChart data={approvalTimeTrend} isLoading={isLoading} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-primary">
                        {avgApprovalTime !== null ? `${avgApprovalTime}d` : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg. Approval Time</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-chart-3">
                        {summary.totalMOCs > 0 
                          ? `${Math.round((summary.approved / summary.totalMOCs) * 100)}%`
                          : "—"
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">Approval Rate</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-chart-4">
                        {summary.totalMOCs > 0 
                          ? `${Math.round((summary.rejected / summary.totalMOCs) * 100)}%`
                          : "—"
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">Rejection Rate</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-chart-5">
                        {summary.totalTasks > 0 
                          ? `${Math.round((summary.completedTasks / summary.totalTasks) * 100)}%`
                          : "—"
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">Task Completion</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <ReportsFacilityChart data={facilityDistribution} isLoading={isLoading} title="MOCs by Facility" />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ReportsTaskChart data={taskStatusDistribution} isLoading={isLoading} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Task Metrics
                  </CardTitle>
                  <CardDescription>Task completion and status overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">{summary.totalTasks}</div>
                      <div className="text-xs text-muted-foreground">Total Tasks</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-chart-3">{summary.completedTasks}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-chart-4">{summary.overdueTasks}</div>
                      <div className="text-xs text-muted-foreground">Overdue</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-chart-5">
                        {summary.totalTasks > 0 
                          ? `${Math.round((summary.completedTasks / summary.totalTasks) * 100)}%`
                          : "—"
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">Completion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
