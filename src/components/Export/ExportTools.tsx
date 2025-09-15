import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Tooltip,
  CardHeader,
  Stack,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Tab,
  Tabs,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Download,
  PictureAsPdf,
  TableChart,
  CheckCircle,
  FileUpload,
  Share,
  ContentCopy,
  MoreVert,
  History,
  Print,
  FilterList,
  Dashboard,
  Sync,
  EmailOutlined,
  Edit
} from '@mui/icons-material';
import { DietPlan, ExportOptions } from '../../types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ExportHistoryItem {
  id: string;
  filename: string;
  format: 'pdf' | 'excel';
  timestamp: Date;
  size: string;
  url?: string;
  data?: Blob | ArrayBuffer;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  options: ExportOptions;
}

const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Report',
    description: 'A comprehensive report with all details',
    preview: 'standard',
    options: {
      includeNutritionFacts: true,
      includeAyurvedicProperties: true,
      includeInstructions: true,
      clinicBranding: true
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A simplified report with essential information only',
    preview: 'minimal',
    options: {
      includeNutritionFacts: true,
      includeAyurvedicProperties: false,
      includeInstructions: false,
      clinicBranding: true
    }
  },
  {
    id: 'clinical',
    name: 'Clinical',
    description: 'Detailed report for healthcare professionals',
    preview: 'clinical',
    options: {
      includeNutritionFacts: true,
      includeAyurvedicProperties: true,
      includeInstructions: true,
      clinicBranding: true
    }
  }
];

const ExportTools: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeNutritionFacts: true,
    includeAyurvedicProperties: true,
    includeInstructions: true,
    clinicBranding: true
  });
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedFiles, setExportedFiles] = useState<ExportHistoryItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Confirmation dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<{
    actionType: string;
    fileFormat?: 'pdf' | 'excel';
    fileId?: string;
  } | null>(null);

  // Mock diet plans for export
  const mockDietPlans: DietPlan[] = [
    {
      id: '1',
      patientId: '1',
      name: 'Diabetes Management Plan',
      duration: 'monthly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      totalCalories: 1800,
      ayurvedicCompliance: 92,
      modernNutritionCompliance: 88,
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      patientId: '2',
      name: 'PCOS Weight Management',
      duration: 'quarterly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      totalCalories: 1600,
      ayurvedicCompliance: 85,
      modernNutritionCompliance: 90,
      meals: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Show notification
  const showNotification = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleExport = async () => {
    setExporting(true);
    setExportProgress(0);

    try {
      const timestamp = new Date();
      const fileName = `diet-plan-${Date.now()}`;
      let url = '';
      let size = '0 KB';
      
      if (selectedFormat === 'excel') {
        try {
          // Set progress to indicate Excel generation started
          setExportProgress(10);
          
          // Create workbook with document properties
          const workbook = new ExcelJS.Workbook();
          workbook.creator = 'NutriVeda AI';
          workbook.lastModifiedBy = 'NutriVeda Export Tool';
          workbook.created = new Date();
          workbook.modified = new Date();
          workbook.properties.date1904 = false;
          
          // Add detailed title page
          const titleSheet = workbook.addWorksheet('Overview', {
            properties: { tabColor: { argb: 'FF4F81BD' } }
          });
          
          setExportProgress(20);
          
          // Add title with logo placeholder
          titleSheet.mergeCells('A1:F1');
          titleSheet.getCell('A1').value = 'NutriVeda Diet Plan Report';
          titleSheet.getCell('A1').font = { 
            size: 16, 
            bold: true, 
            color: { argb: 'FF2962FF' } 
          };
          titleSheet.getRow(1).height = 30;
          
          // Add report information
          titleSheet.mergeCells('A3:B3');
          titleSheet.getCell('A3').value = 'Generated on:';
          titleSheet.getCell('A3').font = { bold: true };
          
          titleSheet.mergeCells('C3:F3');
          titleSheet.getCell('C3').value = timestamp.toLocaleString();
          
          if (exportOptions.clinicBranding) {
            titleSheet.mergeCells('A4:B4');
            titleSheet.getCell('A4').value = 'Authority:';
            titleSheet.getCell('A4').font = { bold: true };
            
            titleSheet.mergeCells('C4:F4');
            titleSheet.getCell('C4').value = 'Ministry of AYUSH Approved';
          }
          
          // Add summary table header
          titleSheet.addRow([]);
          const headerRow = titleSheet.addRow(['Diet Plan Summary']);
          headerRow.font = { bold: true, size: 14 };
          headerRow.height = 20;
          titleSheet.mergeCells(`A${headerRow.number}:F${headerRow.number}`);
          
          setExportProgress(30);
          
          // Create main data worksheet with better formatting
          const worksheet = workbook.addWorksheet('Diet Plan Details', {
            properties: { tabColor: { argb: 'FF92D050' } }
          });
          
          // Add headers with better styling
          worksheet.columns = [
            { header: 'Patient Name', key: 'patientName', width: 20 },
            { header: 'Plan Name', key: 'planName', width: 30 },
            { header: 'Duration', key: 'duration', width: 15 },
            { header: 'Total Calories', key: 'calories', width: 15 },
            { header: 'Ayurvedic Compliance', key: 'ayurvedicCompliance', width: 20 },
            { header: 'Modern Nutrition Compliance', key: 'nutritionCompliance', width: 25 }
          ];
          
          // Style the header row
          const headerStyle = {
            fill: {
              type: 'pattern' as const,
              pattern: 'solid' as const,
              fgColor: { argb: 'FF4F81BD' }
            },
            font: {
              bold: true,
              color: { argb: 'FFFFFFFF' },
              size: 12
            },
            alignment: {
              horizontal: 'center' as const,
              vertical: 'middle' as const
            },
            border: {
              top: { style: 'thin' as const },
              left: { style: 'thin' as const },
              bottom: { style: 'thin' as const },
              right: { style: 'thin' as const }
            }
          };
          
          worksheet.getRow(1).eachCell((cell) => {
            cell.fill = headerStyle.fill;
            cell.font = headerStyle.font;
            cell.alignment = headerStyle.alignment;
            cell.border = headerStyle.border;
          });
          worksheet.getRow(1).height = 22;
          
          setExportProgress(40);
          
          // Add data with better formatting
          mockDietPlans.forEach((plan, index) => {
            setExportProgress(40 + ((index / mockDietPlans.length) * 30)); // Progress from 40-70%
            
            const row = worksheet.addRow({
              patientName: `Patient ${plan.patientId}`,
              planName: plan.name,
              duration: plan.duration,
              calories: plan.totalCalories,
              ayurvedicCompliance: `${plan.ayurvedicCompliance}%`,
              nutritionCompliance: `${plan.modernNutritionCompliance}%`
            });
            
            // Add alternate row styling
            if (index % 2 === 0) {
              row.eachCell((cell) => {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFF5F5F5' }
                };
              });
            }
            
            // Add borders to cells
            row.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
              };
              
              // Center numeric values
              if (typeof cell.value === 'number' || (typeof cell.value === 'string' && cell.value.endsWith('%'))) {
                cell.alignment = { horizontal: 'center' as const };
              }
            });
            
            // Also add this data to the overview sheet
            titleSheet.addRow([
              `Patient ${plan.patientId}`,
              plan.name,
              plan.duration,
              `${plan.totalCalories} cal`,
              `${plan.ayurvedicCompliance}%`,
              `${plan.modernNutritionCompliance}%`
            ]);
          });
          
          // Style the summary table
          const summaryStartRow = 7;
          const summaryEndRow = summaryStartRow + mockDietPlans.length - 1;
          
          // Add header to summary table
          titleSheet.getRow(summaryStartRow - 1).values = ['Patient', 'Plan Name', 'Duration', 'Calories', 'Ayurvedic', 'Modern'];
          titleSheet.getRow(summaryStartRow - 1).eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF4F81BD' }
            };
            cell.font = {
              bold: true,
              color: { argb: 'FFFFFFFF' }
            };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
          
          // Add borders to summary table
          for (let i = summaryStartRow; i <= summaryEndRow; i++) {
            titleSheet.getRow(i).eachCell((cell) => {
              cell.border = {
                top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
              };
            });
          }
          
          setExportProgress(70);

          // Add nutrition analysis worksheet if selected
          if (exportOptions.includeInstructions) {
            const nutritionSheet = workbook.addWorksheet('Nutritional Analysis', {
              properties: { tabColor: { argb: 'FF70AD47' } }
            });
            
            // Add title
            nutritionSheet.mergeCells('A1:D1');
            nutritionSheet.getCell('A1').value = 'Nutritional Analysis Report';
            nutritionSheet.getCell('A1').font = { 
              size: 14, 
              bold: true, 
              color: { argb: 'FF70AD47' } 
            };
            nutritionSheet.getCell('A1').alignment = { horizontal: 'center' as const };
            nutritionSheet.getRow(1).height = 30;
            
            // Add headers with styling
            nutritionSheet.addRow([]); // Add spacing
            nutritionSheet.addRow(['Nutrient', 'Amount', '% Daily Value', 'Recommendation']);
            
            // Style headers
            nutritionSheet.getRow(3).eachCell((cell) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF70AD47' }
              };
              cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }
              };
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
            
            // Add data with better formatting
            const nutrients = [
              ['Protein', '65g', '130%', 'Maintain current intake'],
              ['Carbohydrates', '240g', '80%', 'Consider slight increase'],
              ['Fat', '55g', '85%', 'Balanced - maintain'],
              ['Fiber', '28g', '112%', 'Excellent intake'],
              ['Sugar', '45g', '150%', 'Reduce intake'],
              ['Sodium', '2100mg', '91%', 'Within healthy range'],
              ['Potassium', '3500mg', '102%', 'Optimal level'],
              ['Calcium', '1200mg', '120%', 'Excellent intake']
            ];
            
            nutrients.forEach((nutrient, index) => {
              const row = nutritionSheet.addRow(nutrient);
              
              // Add alternate row styling
              if (index % 2 === 0) {
                row.eachCell((cell) => {
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF5F5F5' }
                  };
                });
              }
              
              // Add borders to cells
              row.eachCell((cell) => {
                cell.border = {
                  top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                  left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                  bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                  right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
                };
              });
            });
            
            // Auto-fit columns
            nutritionSheet.columns.forEach(column => {
              const lengths = column.values?.filter((v): v is string | number | boolean => v != null).map(v => String(v).length);
              const maxLength = Math.max(...(lengths || [10]));
              column.width = maxLength < 12 ? 12 : maxLength;
            });
          }
          
          setExportProgress(90);
          
          // Generate buffer with proper error handling
          try {
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { 
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            
            const excelUrl = createSafeObjectURL(blob);
            size = `${Math.round(blob.size / 1024)} KB`;
            
            // Create download using a more robust method
            const downloadExcel = () => {
              const link = document.createElement('a');
              link.href = excelUrl;
              link.download = `${fileName}.xlsx`;
              link.setAttribute('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              link.setAttribute('target', '_blank');
              document.body.appendChild(link);
              
              // Use a timeout to ensure the download dialog appears
              setTimeout(() => {
                link.click();
                
                // Clean up
                setTimeout(() => {
                  document.body.removeChild(link);
                  URL.revokeObjectURL(excelUrl); // Prevent memory leak
                }, 200);
              }, 0);
              
              url = excelUrl; // Save URL for history
              showNotification('Excel file exported successfully!');
            };
            
            // Execute download
            downloadExcel();
            setExportProgress(100);
            
          } catch (bufferError) {
            console.error('Error generating Excel buffer:', bufferError);
            showNotification('Error generating Excel file. Please try again.');
            throw bufferError;
          }
          
        } catch (excelError) {
          console.error('Excel generation error:', excelError);
          showNotification('Error creating Excel file. Please try again.');
          throw excelError; // Re-throw for the outer catch block
        }
      } else {
        // PDF export with improved handling
        try {
          // Set progress to indicate PDF generation started
          setExportProgress(10);
          
          // Create PDF document with document properties
          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            compress: true
          });
          
          // Set document properties
          doc.setProperties({
            title: 'NutriVeda Diet Plan Report',
            subject: 'Diet Plan Export',
            author: 'NutriVeda AI',
            keywords: 'diet, ayurvedic, nutrition',
            creator: 'NutriVeda Export Tool'
          });
          
          setExportProgress(20);
          
          // Add title with better styling
          doc.setFontSize(18);
          doc.setTextColor(41, 98, 255); // Primary color for title
          doc.text('NutriVeda Diet Plan Report', 14, 20);
          doc.setTextColor(0, 0, 0); // Reset to black
          
          if (exportOptions.clinicBranding) {
            doc.setFontSize(12);
            doc.text('Ministry of AYUSH Approved', 14, 28);
            doc.text(`Generated on: ${timestamp.toLocaleString()}`, 14, 36);
          }
          
          setExportProgress(30);
          
          // Add diet plan data
          doc.setFontSize(14);
          doc.text('Diet Plan Summary', 14, 50);
          
          // Create table with improved styling
          const tableData = mockDietPlans.map(plan => [
            `Patient ${plan.patientId}`,
            plan.name,
            plan.duration,
            `${plan.totalCalories}`,
            `${plan.ayurvedicCompliance}%`,
            `${plan.modernNutritionCompliance}%`
          ]);
          
          setExportProgress(50);
          
          // @ts-ignore - jspdf-autotable typings
          doc.autoTable({
            head: [['Patient', 'Plan Name', 'Duration', 'Calories', 'Ayurvedic', 'Modern']],
            body: tableData,
            startY: 55,
            theme: 'grid',
            headStyles: { 
              fillColor: [41, 98, 255],  // Better blue for header
              textColor: 255,
              fontStyle: 'bold',
              halign: 'center'
            },
            alternateRowStyles: { fillColor: [240, 245, 250] },
            styles: {
              font: 'helvetica',
              overflow: 'linebreak',
              cellWidth: 'auto'
            },
            margin: { top: 10 }
          });
          
          setExportProgress(70);
          
          if (exportOptions.includeAyurvedicProperties) {
            doc.addPage();
            doc.setFontSize(14);
            doc.setTextColor(41, 98, 255);
            doc.text('Ayurvedic Properties Analysis', 14, 20);
            doc.setTextColor(0, 0, 0);
            
            // Add some ayurvedic info with better formatting
            doc.setFontSize(12);
            doc.text('Dosha Balance:', 14, 30);
            doc.text('• Vata: Balanced with warm, moist foods', 20, 38);
            doc.text('• Pitta: Controlled with cooling, sweet foods', 20, 46);
            doc.text('• Kapha: Balanced with light, warm, dry foods', 20, 54);
          }
          
          setExportProgress(90);
          
          // Create blob with correct MIME type
          const blob = doc.output('blob');
          let pdfUrl = createSafeObjectURL(blob);
          size = `${Math.round(blob.size / 1024)} KB`;
          
          // Download function with safety checks
          const downloadPdf = () => {
            try {
              // Get the PDF as a blob
              const pdfBlob = doc.output('blob');
              pdfUrl = createSafeObjectURL(pdfBlob);
              
              // Use our safe download function
              if (safeDownload(pdfBlob, `${fileName}.pdf`, 'application/pdf')) {
                url = pdfUrl; // Save URL for history
                showNotification('PDF file exported successfully!');
              }
            } catch (err) {
              console.error('PDF download error:', err);
              showNotification('Error downloading PDF. Please try again.');
            }
          };
          
          // Execute download
          downloadPdf();
          setExportProgress(100);
        } catch (pdfError) {
          console.error('PDF generation error:', pdfError);
          showNotification('Error generating PDF. Please try again.');
          throw pdfError; // Re-throw to trigger the outer catch block
        }
      }
      
      // Add to export history
      const newExportItem: ExportHistoryItem = {
        id: `export-${Date.now()}`,
        filename: `${fileName}.${selectedFormat}`,
        format: selectedFormat,
        timestamp,
        size,
        url
      };
      
      setExportedFiles(prev => [...prev, newExportItem]);
    } catch (error) {
      console.error('Error exporting file:', error);
      showNotification('Export failed. Please try again.');
    }

    setExporting(false);
    setExportProgress(0);
  };

  const handleBulkExport = async () => {
    setExporting(true);
    setExportProgress(0);
    
    try {
      const timestamp = new Date();
      const fileName = `all-diet-plans-${Date.now()}`;
      let url = '';
      let size = '0 KB';
      
      if (selectedFormat === 'excel') {
        const workbook = new ExcelJS.Workbook();
        
        // Create a worksheet for each diet plan
        mockDietPlans.forEach((plan, index) => {
          setExportProgress((index / mockDietPlans.length) * 50); // First 50% for creating sheets
          
          const worksheet = workbook.addWorksheet(plan.name.slice(0, 31)); // Excel has a 31 char limit for sheet names
          
          // Add headers
          worksheet.columns = [
            { header: 'Patient Name', key: 'patientName', width: 20 },
            { header: 'Start Date', key: 'startDate', width: 15 },
            { header: 'End Date', key: 'endDate', width: 15 },
            { header: 'Total Calories', key: 'calories', width: 15 },
            { header: 'Ayurvedic Compliance', key: 'ayurvedicCompliance', width: 20 },
            { header: 'Modern Nutrition Compliance', key: 'nutritionCompliance', width: 25 }
          ];

          // Add data
          worksheet.addRow({
            patientName: `Patient ${plan.patientId}`,
            startDate: plan.startDate.toLocaleDateString(),
            endDate: plan.endDate.toLocaleDateString(),
            calories: plan.totalCalories,
            ayurvedicCompliance: `${plan.ayurvedicCompliance}%`,
            nutritionCompliance: `${plan.modernNutritionCompliance}%`
          });

          // Style headers
          worksheet.getRow(1).font = { bold: true };
          worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6E6' }
          };
          
          // Add some styling to make it more visually appealing
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              row.eachCell((cell) => {
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
            }
          });
        });

        // Add summary worksheet
        const summarySheet = workbook.addWorksheet('Summary', { properties: { tabColor: { argb: 'FF4F81BD' } } });
        summarySheet.columns = [
          { header: 'Plan Name', key: 'name', width: 25 },
          { header: 'Duration', key: 'duration', width: 15 },
          { header: 'Patient', key: 'patient', width: 20 },
          { header: 'Avg. Compliance', key: 'compliance', width: 18 }
        ];
        
        mockDietPlans.forEach(plan => {
          summarySheet.addRow({
            name: plan.name,
            duration: plan.duration,
            patient: `Patient ${plan.patientId}`,
            compliance: `${Math.round((plan.ayurvedicCompliance + plan.modernNutritionCompliance) / 2)}%`
          });
        });
        
        // Style summary sheet
        summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        summarySheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' }
        };

        setExportProgress(75); // 75% progress after creating all sheets

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        url = createSafeObjectURL(blob);
        size = `${Math.round(blob.size / 1024)} KB`;
        
        // Download the file
        safeDownload(buffer, `${fileName}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        setExportProgress(100);
        showNotification('All diet plans exported successfully!');
      } else {
        // PDF export of all plans
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('NutriVeda - All Diet Plans', 14, 20);
        
        if (exportOptions.clinicBranding) {
          doc.setFontSize(12);
          doc.text('Ministry of AYUSH Approved', 14, 28);
          doc.text(`Generated on: ${timestamp.toLocaleString()}`, 14, 36);
        }
        
        // Add plans summary
        doc.setFontSize(14);
        doc.text('Diet Plans Summary', 14, 50);
        
        // Create table
        const tableData = mockDietPlans.map(plan => [
          `Patient ${plan.patientId}`,
          plan.name,
          plan.duration,
          `${plan.totalCalories}`,
          `${plan.ayurvedicCompliance}%`
        ]);
        
        // @ts-ignore - jspdf-autotable typings
        doc.autoTable({
          head: [['Patient', 'Plan Name', 'Duration', 'Calories', 'Ayurvedic Compliance']],
          body: tableData,
          startY: 55,
          theme: 'grid',
          headStyles: { fillColor: [75, 94, 154], textColor: 255 }
        });
        
        // Add individual plan details
        mockDietPlans.forEach((plan, index) => {
          setExportProgress((index / mockDietPlans.length) * 80);
          
          doc.addPage();
          doc.setFontSize(16);
          doc.text(`${plan.name} - Detail`, 14, 20);
          
          doc.setFontSize(12);
          doc.text(`Patient: Patient ${plan.patientId}`, 14, 30);
          doc.text(`Duration: ${plan.duration}`, 14, 38);
          doc.text(`Period: ${plan.startDate.toLocaleDateString()} to ${plan.endDate.toLocaleDateString()}`, 14, 46);
          doc.text(`Total Calories: ${plan.totalCalories} kcal/day`, 14, 54);
          
          if (exportOptions.includeAyurvedicProperties) {
            doc.text('Ayurvedic Compliance:', 14, 70);
            doc.text(`• Overall: ${plan.ayurvedicCompliance}%`, 20, 78);
            doc.text(`• Modern Nutrition: ${plan.modernNutritionCompliance}%`, 20, 86);
          }
        });
        
        const blob = doc.output('blob');
        url = createSafeObjectURL(blob);
        size = `${Math.round(blob.size / 1024)} KB`;
        
        // Use our safe download function
        if (safeDownload(blob, `${fileName}.pdf`, 'application/pdf')) {
          showNotification('PDF file with all plans exported successfully!');
        }
      }
      
      // Add to export history
      const newExportItem: ExportHistoryItem = {
        id: `export-${Date.now()}`,
        filename: `${fileName}.${selectedFormat}`,
        format: selectedFormat,
        timestamp,
        size,
        url
      };
      
      setExportedFiles(prev => [...prev, newExportItem]);
    } catch (error) {
      console.error('Error exporting files:', error);
      showNotification('Export failed. Please try again.');
    }

    setExporting(false);
    setExportProgress(0);
  };

  const getFormatIcon = (format: string) => {
    return format === 'pdf' ? <PictureAsPdf /> : <TableChart />;
  };


  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = EXPORT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setExportOptions(template.options);
    }
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Function to download a file from export history with improved handling
  const handleDownloadFromHistory = (file: ExportHistoryItem) => {
    try {
      // First try to use the stored raw data if available
      if (file.data) {
        // Determine the MIME type
        let mimeType = 'application/octet-stream';
        if (file.format === 'pdf') {
          mimeType = 'application/pdf';
        } else if (file.format === 'excel') {
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }
        
        // Use our safe download function with the stored raw data
        if (safeDownload(file.data, file.filename, mimeType)) {
          showNotification(`${file.filename} download started successfully`);
          return;
        }
      }
      
      // Fall back to URL if data is not available
      if (file.url) {
        // Check if the URL is still valid
        try {
          // This is a trick to check if the blob URL is still valid
          // If it's not, this will throw an error
          const testFetch = new Request(file.url);
          if (testFetch.url === 'about:blank') {
            throw new Error('Invalid URL');
          }
          
          // Determine the MIME type
          let mimeType = 'application/octet-stream';
          if (file.format === 'pdf') {
            mimeType = 'application/pdf';
          } else if (file.format === 'excel') {
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          }
          
          // Fetch the blob from the URL and download it
          fetch(file.url)
            .then(response => response.blob())
            .then(blob => {
              // Use our safe download function
              if (safeDownload(blob, file.filename, mimeType)) {
                showNotification(`${file.filename} download started successfully`);
              }
            })
            .catch(error => {
              console.error('Fetch error:', error);
              throw error;
            });
          
          showNotification(`${file.filename} download started successfully`);
        } catch (error) {
          console.error('URL access error:', error);
          showNotification('This file is no longer available in the browser memory. Please export it again.');
          
          // Update the export history item to mark URL as invalid
          setExportedFiles(prev => prev.map(item => 
            item.id === file.id ? { ...item, url: undefined } : item
          ));
        }
      } else {
        // Handle expired URLs
        showNotification('File URL is no longer available. Browser sessions do not permanently store files. Please export again.');
        
        // Show confirmation dialog instead of using global confirm
        setDialogAction({
          actionType: 'regenerateFile',
          fileFormat: file.format
        });
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Download error:', error);
      showNotification('Error downloading file. Please try exporting again.');
    }
  };
  
  // Type declaration for IE-specific navigator API
  interface IENavigator extends Navigator {
    msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean;
  }

  // Safe download function that handles different file types
  const safeDownload = (data: Blob | ArrayBuffer, filename: string, mimeType: string): boolean => {
    try {
      // Convert ArrayBuffer to Blob if needed
      const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
      
      // Create a safe URL
      const url = createSafeObjectURL(blob);
      
      // Use the FileSaver API if available
      const nav = window.navigator as IENavigator;
      if (nav && nav.msSaveOrOpenBlob) {
        // For IE
        nav.msSaveOrOpenBlob(blob, filename);
      } else {
        // For other browsers
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.setAttribute('type', mimeType);
        
        // Append to the DOM temporarily
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
        }, 200);
      }
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      showNotification('Download failed. Please try again.');
      return false;
    }
  };
  
  // Helper function to safely create object URLs with memory management
  const createSafeObjectURL = (blob: Blob): string => {
    const url = URL.createObjectURL(blob);
    
    // Schedule cleanup after a reasonable time (e.g., 5 minutes)
    // This helps prevent memory leaks if the user keeps the app open for a long time
    setTimeout(() => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Failed to revoke URL:', error);
      }
    }, 5 * 60 * 1000);
    
    return url;
  };
  
  // Handle dialog actions
  const handleDialogAction = () => {
    if (dialogAction) {
      switch (dialogAction.actionType) {
        case 'regenerateFile':
          if (dialogAction.fileFormat) {
            setSelectedFormat(dialogAction.fileFormat);
            handleExport();
          }
          break;
        // Add other dialog action types here if needed
      }
    }
    setDialogOpen(false);
    setDialogAction(null);
  };

  return (
    <Box>
      {/* Header with action buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 2
      }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Export Tools
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            value={selectedFormat}
            exclusive
            onChange={(e, newFormat) => newFormat && setSelectedFormat(newFormat as 'pdf' | 'excel')}
            aria-label="export format"
            size="small"
            color="primary"
          >
            <ToggleButton value="pdf">
              <PictureAsPdf sx={{ mr: 1 }} fontSize="small" />
              PDF
            </ToggleButton>
            <ToggleButton value="excel">
              <TableChart sx={{ mr: 1 }} fontSize="small" />
              Excel
            </ToggleButton>
          </ToggleButtonGroup>

          <Button 
            variant="outlined" 
            startIcon={<Share />}
            size="small"
          >
            Share
          </Button>

          <Button 
            variant="contained" 
            startIcon={<Print />}
            size="small"
          >
            Print
          </Button>
        </Box>
      </Box>
      
      {/* Main Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="export options tabs">
          <Tab label="Export" icon={<Download />} iconPosition="start" />
          <Tab label="Templates" icon={<Dashboard />} iconPosition="start" />
          <Tab label="History" icon={<History />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Export Tab Panel */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Export Configuration */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ 
              height: '100%',
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
              }
            }}>
              <CardHeader
                title="Export Configuration"
                titleTypographyProps={{ variant: 'h6' }}
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <Download />
                  </Avatar>
                }
                action={
                  <Tooltip title="Reset Settings">
                    <IconButton onClick={() => setExportOptions(EXPORT_TEMPLATES[0].options)}>
                      <Sync fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Template: <Chip size="small" label={EXPORT_TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Custom'} />
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                  Include in Export:
                </Typography>
                
                <Stack spacing={0.5}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exportOptions.includeNutritionFacts}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          includeNutritionFacts: e.target.checked
                        }))}
                        color="primary"
                      />
                    }
                    label="Nutrition Facts"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exportOptions.includeAyurvedicProperties}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          includeAyurvedicProperties: e.target.checked
                        }))}
                        color="primary"
                      />
                    }
                    label="Ayurvedic Properties"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exportOptions.includeInstructions}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          includeInstructions: e.target.checked
                        }))}
                        color="primary"
                      />
                    }
                    label="Cooking Instructions"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exportOptions.clinicBranding}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          clinicBranding: e.target.checked
                        }))}
                        color="primary"
                      />
                    }
                    label="Clinic Branding"
                  />
                </Stack>
                
                <TextField
                  fullWidth
                  label="Custom Notes"
                  multiline
                  rows={2}
                  placeholder="Add any additional notes for the export..."
                  sx={{ mt: 3 }}
                  variant="outlined"
                  size="small"
                />
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column' }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleExport}
                  disabled={exporting}
                  startIcon={exporting ? <CircularProgress size={18} color="inherit" /> : getFormatIcon(selectedFormat)}
                  sx={{ mb: 1 }}
                >
                  {exporting ? 'Exporting...' : 'Export Single Plan'}
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleBulkExport}
                  disabled={exporting}
                  startIcon={exporting ? <CircularProgress size={18} color="inherit" /> : <Download />}
                >
                  Bulk Export All Plans
                </Button>
                
                {exporting && (
                  <Box sx={{ mt: 2, width: '100%' }}>
                    <LinearProgress variant="determinate" value={exportProgress} sx={{ height: 6, borderRadius: 3 }} />
                    <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 0.5 }}>
                      {exportProgress}% complete
                    </Typography>
                  </Box>
                )}
              </CardActions>
            </Card>
          </Grid>
          
          {/* Available Diet Plans and Preview */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Diet Plans Card */}
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Available Diet Plans"
                  titleTypographyProps={{ variant: 'h6' }}
                  action={
                    <IconButton>
                      <FilterList fontSize="small" />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent sx={{ pt: 0 }}>
                  <List>
                    {mockDietPlans.map((plan, index) => (
                      <React.Fragment key={plan.id}>
                        <ListItem 
                          sx={{ 
                            borderRadius: 1,
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                            mt: 1,
                          }}
                        >
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: index % 2 === 0 ? 'primary.light' : 'secondary.light' }}>
                              {getFormatIcon(selectedFormat)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="medium">
                                {plan.name}
                              </Typography>
                            }
                            secondary={`${plan.duration} • ${plan.totalCalories} cal/day • ${plan.startDate.toLocaleDateString()} to ${plan.endDate.toLocaleDateString()}`}
                          />
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={`${plan.ayurvedicCompliance}% Ayurvedic`} 
                              size="small" 
                              color="success"
                              variant="outlined" 
                            />
                            <Chip 
                              label={`${plan.modernNutritionCompliance}% Modern`} 
                              size="small" 
                              color="info"
                              variant="outlined"
                            />
                            <Button 
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<Download />}
                              onClick={handleExport}
                              disabled={exporting}
                            >
                              Export
                            </Button>
                          </Box>
                        </ListItem>
                        {index < mockDietPlans.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
              
              {/* Export Preview with Chart */}
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Export Preview"
                  titleTypographyProps={{ variant: 'h6' }}
                  subheader="How your export will appear"
                  action={
                    <IconButton>
                      <Edit fontSize="small" />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      bgcolor: 'background.default', 
                      border: '1px solid', 
                      borderColor: 'divider',
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        NutriVeda - AI-Powered Ayurvedic Nutrition
                      </Typography>
                      {exportOptions.clinicBranding && (
                        <Chip label="AYUSH Approved" color="success" size="small" />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Patient:</strong> Rajesh Kumar | <strong>Generated:</strong> {new Date().toLocaleDateString()}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Diet Plan Overview
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                      <Chip label="Total Calories: 1800 kcal/day" color="primary" />
                      <Chip label="Duration: 30 days" color="secondary" />
                      <Chip label="Ayurvedic Compliance: 92%" color="success" />
                      <Chip label="Modern Nutrition: 88%" color="info" />
                    </Box>
                    
                    {/* Add nutrition chart visualization */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Nutritional Distribution
                      </Typography>
                      <Box height={200}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Protein', value: 20 },
                                { name: 'Carbs', value: 50 },
                                { name: 'Fats', value: 30 }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(entry) => `${entry.name}: ${entry.value}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              <Cell fill="#8884d8" />
                              <Cell fill="#82ca9d" />
                              <Cell fill="#ffc658" />
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                    
                    {exportOptions.includeNutritionFacts && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                          Nutrition Facts
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Protein: 15-20% of daily calories<br />
                          • Carbohydrates: 45-50% of daily calories<br />
                          • Fats: 25-30% of daily calories<br />
                          • Fiber: 25-35g per day
                        </Typography>
                      </Box>
                    )}
                    
                    {exportOptions.includeAyurvedicProperties && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                          Ayurvedic Properties
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Rasa: Sweet, Pungent, Astringent<br />
                          • Guna: Light, Warm, Dry<br />
                          • Virya: Heating<br />
                          • Vipaka: Sweet
                        </Typography>
                      </Box>
                    )}
                    
                    {exportOptions.clinicBranding && (
                      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Generated by NutriVeda AI Platform | Ministry of AYUSH Approved | {new Date().toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      )}
      
      {/* Templates Tab Panel */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {EXPORT_TEMPLATES.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card 
                elevation={3} 
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: selectedTemplate === template.id ? '2px solid' : '1px solid',
                  borderColor: selectedTemplate === template.id ? 'primary.main' : 'divider',
                  transition: 'transform 0.2s, border 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                  position: 'relative',
                  overflow: 'visible'
                }}
                onClick={() => handleTemplateChange(template.id)}
              >
                {selectedTemplate === template.id && (
                  <Chip 
                    label="Selected" 
                    color="primary" 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      right: 10,
                      zIndex: 1
                    }} 
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>{template.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{template.description}</Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Template includes:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {template.options.includeNutritionFacts && <Chip label="Nutrition Facts" size="small" variant="outlined" />}
                      {template.options.includeAyurvedicProperties && <Chip label="Ayurvedic Info" size="small" variant="outlined" />}
                      {template.options.includeInstructions && <Chip label="Instructions" size="small" variant="outlined" />}
                      {template.options.clinicBranding && <Chip label="Branding" size="small" variant="outlined" />}
                    </Stack>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateChange(template.id);
                      setTabValue(0);
                    }}
                  >
                    Use Template
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* History Tab Panel */}
      {tabValue === 2 && (
        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardHeader 
            title="Export History" 
            titleTypographyProps={{ variant: 'h6' }}
            subheader={`${exportedFiles.length} exports generated`}
            action={
              exportedFiles.length > 0 && (
                <Button 
                  startIcon={<Download />} 
                  size="small" 
                  variant="outlined"
                >
                  Download All
                </Button>
              )
            }
          />
          <Divider />
          <CardContent>
            {exportedFiles.length > 0 ? (
              <List>
                {exportedFiles.map((file, index) => (
                  <React.Fragment key={file.id}>
                    <ListItem 
                      sx={{ 
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: file.format === 'pdf' ? 'error.light' : 'success.light' }}>
                          {file.format === 'pdf' ? <PictureAsPdf /> : <TableChart />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={file.filename}
                        secondary={`Exported on ${file.timestamp.toLocaleString()} • ${file.size}`}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<EmailOutlined />}
                        >
                          Email
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained"
                          startIcon={<Download />}
                          onClick={() => handleDownloadFromHistory(file)}
                        >
                          Download
                        </Button>
                      </Box>
                    </ListItem>
                    {index < exportedFiles.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <History sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Export History
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your exported files will appear here
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Download />}
                  onClick={() => setTabValue(0)}
                >
                  Create Your First Export
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogAction?.actionType === 'regenerateFile' ? 'Regenerate Export File?' : 'Confirm Action'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogAction?.actionType === 'regenerateFile' 
              ? 'Would you like to generate this file again? The browser session does not permanently store files.'
              : 'Please confirm you want to proceed with this action.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogAction} color="primary" variant="contained" autoFocus>
            {dialogAction?.actionType === 'regenerateFile' ? 'Regenerate File' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExportTools;
