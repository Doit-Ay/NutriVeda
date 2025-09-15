import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Stack,
  Skeleton,
  Badge,
  Popover,
  Fade,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, addDays, subDays, subMonths, subYears } from 'date-fns';
import {
  Assessment,
  Download,
  Print,
  Share,
  TrendingUp,
  TrendingDown,
  People,
  Restaurant,
  Psychology,
  Schedule,
  CheckCircle,
  Warning,
  Info,
  FilterList,
  Refresh,
  BarChart,
  PieChart as PieChartIcon,
  Timeline,
  FileDownload,
  CalendarToday,
  NavigateNext,
  NavigateBefore,
  LocalPrintshop,
  CloudDownload,
  Email
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap
} from 'recharts';
import { mockPatients, mockDashboardStats } from '../../data/mockData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Custom date range component
const DateRangeSelector: React.FC<{
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            if (newValue) onStartDateChange(newValue);
          }}
          slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
        />
        <Typography variant="body2" sx={{ mx: 0.5 }}>to</Typography>
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => {
            if (newValue) onEndDateChange(newValue);
          }}
          slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
        />
      </Box>
    </LocalizationProvider>
  );
};

// Date range presets
const getDateRangePreset = (preset: string): [Date, Date] => {
  const today = new Date();
  switch (preset) {
    case 'week':
      return [subDays(today, 7), today];
    case 'month':
      return [subMonths(today, 1), today];
    case 'quarter':
      return [subMonths(today, 3), today];
    case 'year':
      return [subYears(today, 1), today];
    default:
      return [subDays(today, 30), today];
  }
};

const Reports: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleGenerateReport = (reportType: string) => {
    setSelectedReport(reportType);
    setOpenDialog(true);
    setIsGenerating(true);
    
    // Simulate report generation with delay
    setTimeout(() => {
      setReportData(generateMockReportData(reportType));
      setIsGenerating(false);
    }, 1200);
  };
  
  // Handle exporting all reports
  const handleExportAll = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // In a real app, this would call the API to generate exports
      console.log("Exporting all reports...");
      // Show success message
      alert("All reports exported successfully! Check your downloads folder.");
      setIsExporting(false);
    }, 2000);
  };
  
  // Handle exporting a single report
  const handleExportReport = (reportType: string, format: 'pdf' | 'excel' = 'pdf') => {
    console.log(`Exporting ${reportType} report in ${format} format...`);
    
    // In a real app, this would call the API to generate the export
    setTimeout(() => {
      alert(`${reportType} report exported as ${format.toUpperCase()}!`);
    }, 1500);
  };
  
  const handleDateRangeChange = (preset: string) => {
    setDateRange(preset);
    if (preset !== 'custom') {
      const [start, end] = getDateRangePreset(preset);
      setStartDate(start);
      setEndDate(end);
      setShowDateRangePicker(false);
    } else {
      setShowDateRangePicker(true);
    }
  };

  const generateMockReportData = (reportType: string) => {
    switch (reportType) {
      case 'patient-compliance':
        return {
          title: 'Patient Compliance Report',
          period: 'January 2024',
          data: [
            { patient: 'Rajesh Kumar', compliance: 92, trend: 'up', status: 'excellent' },
            { patient: 'Priya Sharma', compliance: 85, trend: 'up', status: 'good' },
            { patient: 'Anita Patel', compliance: 95, trend: 'up', status: 'excellent' },
            { patient: 'Vikram Singh', compliance: 78, trend: 'down', status: 'needs_attention' },
            { patient: 'Sushma Reddy', compliance: 88, trend: 'up', status: 'good' }
          ]
        };
      case 'diet-effectiveness':
        return {
          title: 'Diet Plan Effectiveness Report',
          period: 'January 2024',
          data: [
            { plan: 'Diabetes Management', effectiveness: 88, patients: 12, avgCompliance: 89 },
            { plan: 'PCOS Weight Management', effectiveness: 85, patients: 8, avgCompliance: 87 },
            { plan: 'Vata Pacifying Plan', effectiveness: 92, patients: 15, avgCompliance: 94 },
            { plan: 'Heart Health Plan', effectiveness: 90, patients: 10, avgCompliance: 91 },
            { plan: 'Anti-Inflammatory Plan', effectiveness: 87, patients: 6, avgCompliance: 88 }
          ]
        };
      case 'nutritional-analysis':
        return {
          title: 'Nutritional Analysis Report',
          period: 'January 2024',
          data: [
            { nutrient: 'Calories', avgIntake: 1750, recommended: 1800, status: 'good' },
            { nutrient: 'Protein', avgIntake: 65, recommended: 70, status: 'needs_improvement' },
            { nutrient: 'Carbs', avgIntake: 220, recommended: 225, status: 'good' },
            { nutrient: 'Fats', avgIntake: 58, recommended: 60, status: 'good' },
            { nutrient: 'Fiber', avgIntake: 28, recommended: 30, status: 'needs_improvement' }
          ]
        };
      case 'ayurvedic-compliance':
        return {
          title: 'Ayurvedic Compliance Report',
          period: 'January 2024',
          data: [
            { dosha: 'Vata', compliance: 89, patients: 25, avgImprovement: 15 },
            { dosha: 'Pitta', compliance: 92, patients: 30, avgImprovement: 18 },
            { dosha: 'Kapha', compliance: 85, patients: 20, avgImprovement: 12 },
            { dosha: 'Mixed', compliance: 87, patients: 15, avgImprovement: 14 }
          ]
        };
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'needs_attention': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle color="success" />;
      case 'good': return <CheckCircle color="info" />;
      case 'needs_attention': return <Warning color="warning" />;
      case 'poor': return <Warning color="error" />;
      default: return <Info />;
    }
  };

  const ReportCard = ({ title, description, icon, color, reportType }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    reportType: string;
  }) => (
    <Card sx={{ height: '100%', background: '#fff', boxShadow: '0 4px 16px 0 rgba(0,0,0,0.07)', borderRadius: 4, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: '#f5f5f5', color: '#555', mr: 2, border: '1px solid #e0e0e0' }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" sx={{ color: '#222', fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => handleGenerateReport(reportType)}
          sx={{ mt: 2 }}
        >
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );

  // Visualization component for compliance data
  const ComplianceVisualization = () => {
    // Historical compliance data for line chart
    const historicalData = [
      { month: 'Aug', compliance: 75 },
      { month: 'Sep', compliance: 82 },
      { month: 'Oct', compliance: 88 },
      { month: 'Nov', compliance: 86 },
      { month: 'Dec', compliance: 90 },
      { month: 'Jan', compliance: 92 },
    ];

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Compliance Trends</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="compliance" 
                    name="Patient Compliance %" 
                    stroke="#3f51b5" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Compliance Distribution</Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Excellent', value: 45 },
                      { name: 'Good', value: 30 },
                      { name: 'Needs Attention', value: 20 },
                      { name: 'Poor', value: 5 },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    <Cell fill="#4caf50" />
                    <Cell fill="#2196f3" />
                    <Cell fill="#ff9800" />
                    <Cell fill="#f44336" />
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const ComplianceTable = () => (
    <Box>
      <ComplianceVisualization />
      <Box sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell>Patient</TableCell>
                <TableCell>Compliance %</TableCell>
                <TableCell>Trend</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isGenerating ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={100} height={24} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={80} height={24} /></TableCell>
                  </TableRow>
                ))
              ) : reportData?.data.map((row: any, index: number) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 1, width: 30, height: 30, fontSize: '0.875rem' }}>
                        {row.patient.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2">{row.patient}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={row.compliance}
                        sx={{ 
                          width: 100, 
                          mr: 2, 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: 'rgba(0,0,0,0.08)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: row.compliance > 90 ? '#4caf50' : 
                                     row.compliance > 80 ? '#2196f3' : 
                                     row.compliance > 70 ? '#ff9800' : '#f44336'
                          }
                        }}
                      />
                      <Typography variant="body2" fontWeight="medium">{row.compliance}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {row.trend === 'up' ? (
                        <TrendingUp color="success" fontSize="small" />
                      ) : (
                        <TrendingDown color="error" fontSize="small" />
                      )}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {row.trend === 'up' ? 'Improving' : 'Declining'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(row.status)}
                      label={row.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(row.status) as any}
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">2 days ago</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Assessment fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Report">
                        <IconButton 
                          size="small" 
                          onClick={() => handleExportReport('patient-compliance', 'pdf')}
                        >
                          <CloudDownload fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share">
                        <IconButton size="small">
                          <Email fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );

  // Visualization component for diet effectiveness data
  const DietEffectivenessVisualization = () => {
    // Create data for comparison bar chart
    const effectivenessData = reportData?.data.map((item: any) => ({
      name: item.plan,
      effectiveness: item.effectiveness,
      compliance: item.avgCompliance
    })) || [];

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Diet Plan Effectiveness vs. Compliance</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={effectivenessData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 100]} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="effectiveness" name="Effectiveness %" fill="#8884d8" barSize={30} radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="compliance" name="Compliance %" fill="#82ca9d" barSize={30} radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };



  const DietEffectivenessTable = () => (
    <Box>
      {!isGenerating && reportData?.data && <DietEffectivenessVisualization />}
      <Box sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell>Diet Plan</TableCell>
                <TableCell>Effectiveness %</TableCell>
                <TableCell>Patients</TableCell>
                <TableCell>Avg Compliance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isGenerating ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width={180} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={80} height={24} /></TableCell>
                  </TableRow>
                ))
              ) : reportData?.data.map((row: any, index: number) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{row.plan}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={row.effectiveness}
                        sx={{ width: 100, mr: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">{row.effectiveness}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={`${row.patients} patients`} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={row.avgCompliance}
                        sx={{ width: 60, mr: 2, height: 8, borderRadius: 4 }}
                        color="secondary"
                      />
                      <Typography variant="body2">{row.avgCompliance}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Assessment fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton 
                          size="small"
                          onClick={() => handleExportReport('diet-effectiveness', 'pdf')}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );

  // Nutrition Analysis Visualization Component
  const NutritionalAnalysisVisualization = () => {
    // Process data for radar chart
    const radarData = reportData?.data?.map((item: any) => ({
      nutrient: item.nutrient,
      value: (item.avgIntake / item.recommended) * 100, // Convert to percentage of recommended intake
    })) || [];

    // Process data for comparison chart
    const comparisonData = reportData?.data?.map((item: any) => ({
      name: item.nutrient,
      actual: item.avgIntake,
      recommended: item.recommended,
    })) || [];

    return (
      <Box sx={{ mb: 4 }}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Nutritional Analysis Overview</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ height: 350 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Intake vs. Recommended</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={comparisonData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    barGap={0}
                    barCategoryGap="15%"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Amount', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar name="Actual Intake" dataKey="actual" fill="#8884d8" />
                    <Bar name="Recommended" dataKey="recommended" fill="#82ca9d" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ height: 350 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Dietary Balance (% of Target)</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="nutrient" />
                    <PolarRadiusAxis domain={[0, 120]} />
                    <Radar
                      name="% of Recommendation"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
    );
  };
  
  const NutritionalAnalysisTable = () => (
    <Box>
      <NutritionalAnalysisVisualization />
      <Box sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nutrient</TableCell>
                <TableCell>Average Intake</TableCell>
                <TableCell>Recommended</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData?.data.map((row: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="subtitle2">{row.nutrient}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.avgIntake}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.recommended}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(row.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Assessment fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton 
                          size="small"
                          onClick={() => handleExportReport('nutritional-analysis', 'pdf')}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );

  // Ayurvedic Compliance Visualization Component
  const AyurvedicComplianceVisualization = () => {
    // Data for dosha compliance distribution
    const doshaData = reportData?.data || [];

    // Data for improvement radar chart
    const radarData = reportData?.data?.map((item: any) => ({
      subject: item.dosha,
      A: item.compliance,
      B: item.avgImprovement * 5, // Scale for visualization
      fullMark: 100,
    })) || [];

    return (
      <Box sx={{ mb: 4 }}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Ayurvedic Analysis Overview</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: 350 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Dosha Compliance Distribution</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={doshaData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dosha" />
                    <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar name="Compliance %" dataKey="compliance" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: 350 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Dosha Analysis</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Compliance"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Improvement"
                      dataKey="B"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
    );
  };

  const AyurvedicComplianceTable = () => (
    <Box>
      <AyurvedicComplianceVisualization />
      <Box sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dosha</TableCell>
                <TableCell>Compliance %</TableCell>
                <TableCell>Patients</TableCell>
                <TableCell>Avg Improvement</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData?.data.map((row: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip label={row.dosha} color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={row.compliance}
                        sx={{ width: 100, mr: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2">{row.compliance}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.patients}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">+{row.avgImprovement}%</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Assessment fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton 
                          size="small"
                          onClick={() => handleExportReport('ayurvedic-compliance', 'pdf')}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports & Analytics
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<Refresh />} sx={{ mr: 2 }}>
            Refresh Data
          </Button>
          <Button 
            variant="contained" 
            startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : <Download />}
            onClick={handleExportAll}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export All'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={dateRange}
            label="Date Range"
            onChange={(e) => setDateRange(e.target.value)}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Patient</InputLabel>
          <Select
            value={selectedPatient}
            label="Patient"
            onChange={(e) => setSelectedPatient(e.target.value)}
          >
            <MenuItem value="all">All Patients</MenuItem>
            {mockPatients.map(patient => (
              <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" startIcon={<FilterList />}>
          More Filters
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Report Templates" />
          <Tab label="Generated Reports" />
          <Tab label="Analytics Dashboard" />
        </Tabs>
      </Box>

      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <ReportCard
              title="Patient Compliance"
              description="Track patient adherence to diet plans and identify areas for improvement"
              icon={<People />}
              color="primary.main"
              reportType="patient-compliance"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ReportCard
              title="Diet Effectiveness"
              description="Analyze the effectiveness of different diet plans and their outcomes"
              icon={<Restaurant />}
              color="success.main"
              reportType="diet-effectiveness"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ReportCard
              title="Nutritional Analysis"
              description="Comprehensive nutritional analysis across all patients and diet plans"
              icon={<Assessment />}
              color="info.main"
              reportType="nutritional-analysis"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ReportCard
              title="Ayurvedic Compliance"
              description="Monitor adherence to Ayurvedic principles and dosha-specific recommendations"
              icon={<Psychology />}
              color="warning.main"
              reportType="ayurvedic-compliance"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ReportCard
              title="Custom Report"
              description="Create custom reports with specific parameters and data points"
              icon={<BarChart />}
              color="error.main"
              reportType="custom"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ReportCard
              title="Export Data"
              description="Export patient data, diet plans, and analytics in various formats"
              icon={<Download />}
              color="secondary.main"
              reportType="export"
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        {reportData ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">{reportData.title}</Typography>
              <Box>
                <Button variant="outlined" startIcon={<Print />} sx={{ mr: 2 }}>
                  Print
                </Button>
                <Button variant="outlined" startIcon={<Share />} sx={{ mr: 2 }}>
                  Share
                </Button>
                <Button variant="contained" startIcon={<Download />}>
                  Download PDF
                </Button>
              </Box>
            </Box>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Report Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Period</Typography>
                    <Typography variant="h6">{reportData.period}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Total Records</Typography>
                    <Typography variant="h6">{reportData.data.length}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Generated</Typography>
                    <Typography variant="h6">{new Date().toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip label="Complete" color="success" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {selectedReport === 'patient-compliance' && <ComplianceTable />}
            {selectedReport === 'diet-effectiveness' && <DietEffectivenessTable />}
            {selectedReport === 'nutritional-analysis' && <NutritionalAnalysisTable />}
            {selectedReport === 'ayurvedic-compliance' && <AyurvedicComplianceTable />}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Reports Generated Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a report template from the "Report Templates" tab to generate your first report.
            </Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Key Performance Indicators
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <People color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Patients"
                      secondary={mockDashboardStats.totalPatients}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Restaurant color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Active Diet Plans"
                      secondary={mockDashboardStats.activeDietPlans}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Completed Consultations"
                      secondary={mockDashboardStats.completedConsultations}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Average Compliance"
                      secondary={`${mockDashboardStats.averageCompliance}%`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {mockDashboardStats.recentActivity.map((activity) => (
                    <ListItem key={activity.id}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={activity.timestamp.toLocaleDateString()}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Report</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Select the parameters for your report:
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Date Range</InputLabel>
              <Select value={dateRange} label="Date Range">
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Patient</InputLabel>
              <Select value={selectedPatient} label="Patient">
                <MenuItem value="all">All Patients</MenuItem>
                {mockPatients.map(patient => (
                  <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Report Title"
              defaultValue={reportData?.title || ''}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
