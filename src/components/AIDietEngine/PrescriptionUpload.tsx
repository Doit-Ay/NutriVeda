import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  CloudUpload,
  Psychology,
  Restaurant,
  Timeline,
  Edit,
  CheckCircle,
  Warning,
  Add,
  Remove,
  Person,
  MedicalServices,
  Healing,
  NoFood,
  Cancel,
  Save,
  ExpandMore,
  Visibility,
  Image
} from '@mui/icons-material';
import { PrescriptionData } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ProcessingStage {
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  complete: boolean;
}

const PrescriptionUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<PrescriptionData | null>(null);
  const [editedData, setEditedData] = useState<PrescriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [processingStages, setProcessingStages] = useState<ProcessingStage[]>([
    { name: 'Image Analysis', description: 'Analyzing prescription image clarity and orientation', icon: <Image color="primary" />, progress: 0, complete: false },
    { name: 'Text Extraction', description: 'Converting image to text using OCR', icon: <Psychology color="primary" />, progress: 0, complete: false },
    { name: 'Data Processing', description: 'Extracting patient data and recommendations', icon: <Person color="primary" />, progress: 0, complete: false },
    { name: 'Ayurvedic Analysis', description: 'Analyzing dosha compatibility and constraints', icon: <Healing color="primary" />, progress: 0, complete: false },
  ]);
  const [newFood, setNewFood] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle drag and drop events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf')) {
      handleFileSelection(file);
    } else {
      setError('Please upload a PDF, JPG, or PNG file');
    }
  };

  // Process the uploaded prescription
  const processPrescription = async (file: File) => {
    setUploading(true);
    setError(null);
    setProcessingStages(stages => 
      stages.map(stage => ({ ...stage, progress: 0, complete: false }))
    );
    
    // Create file preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    // Process each stage with different timing to simulate real processing
    for (let stageIndex = 0; stageIndex < processingStages.length; stageIndex++) {
      setCurrentStage(stageIndex);
      
      // Simulate processing for each stage
      for (let i = 0; i <= 100; i += 5) {
        setProcessingStages(prevStages => {
          const newStages = [...prevStages];
          newStages[stageIndex].progress = i;
          return newStages;
        });
        
        // Overall progress is a weighted average of all stages
        const overallProgress = Math.floor(
          (stageIndex * 100 + i) / processingStages.length
        );
        setUploadProgress(overallProgress);
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Mark stage as complete
      setProcessingStages(prevStages => {
        const newStages = [...prevStages];
        newStages[stageIndex].complete = true;
        return newStages;
      });
    }

    // Mock extracted data
    const mockExtractedData: PrescriptionData = {
        patientName: 'Rajesh Kumar',
        age: 45,
        gender: 'male',
        dosha: 'Pitta',
        disease: 'Diabetes',
        allergies: ['Peanuts', 'Shellfish'],
        foods: ['Oats', 'Milk', 'Banana', 'Brown rice', 'Dal', 'Vegetables', 'Green tea', 'Nuts', 'Roti', 'Sabzi', 'Curd'],
        timestamp: new Date().toISOString(),
    };

    setExtractedData(mockExtractedData);
    setEditedData(mockExtractedData); // Initialize edited data with extracted data
    setUploading(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };
  
  const handleFileSelection = (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }
    
    // Validate file type
    if (
      file.type !== 'application/pdf' && 
      file.type !== 'image/jpeg' && 
      file.type !== 'image/jpg' && 
      file.type !== 'image/png'
    ) {
      setError('Invalid file type. Please upload PDF, JPG, or PNG files only.');
      return;
    }
    
    setUploadedFile(file);
    processPrescription(file);
  };

  const generateDietPlan = () => {
    // This would trigger the AI diet generation with the edited data
    console.log('Generating diet plan from prescription...', editedData);
    navigate('/ai-diet-engine/generate', { state: { prescriptionData: editedData } });
  };
  
  const toggleEdit = () => {
    if (isEditing && extractedData) {
      // Save changes
      setIsEditing(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };
  
  const handleEditField = (field: keyof PrescriptionData, value: any) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [field]: value
      });
    }
  };
  
  const addFood = () => {
    if (newFood.trim() && editedData) {
      setEditedData({
        ...editedData,
        foods: [...editedData.foods, newFood.trim()]
      });
      setNewFood('');
    }
  };
  
  const removeFood = (index: number) => {
    if (editedData) {
      const newFoods = [...editedData.foods];
      newFoods.splice(index, 1);
      setEditedData({
        ...editedData,
        foods: newFoods
      });
    }
  };
  
  const addAllergy = () => {
    if (newAllergy.trim() && editedData) {
      setEditedData({
        ...editedData,
        allergies: [...editedData.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };
  
  const removeAllergy = (index: number) => {
    if (editedData) {
      const newAllergies = [...editedData.allergies];
      newAllergies.splice(index, 1);
      setEditedData({
        ...editedData,
        allergies: newAllergies
      });
    }
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Prescription Upload & Processing
      </Typography>
      
      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CloudUpload sx={{ mr: 1, color: 'primary.main' }} />
                Upload Doctor's Prescription
              </Typography>
              
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'action.hover',
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    borderColor: 'primary.dark',
                  }
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                {imagePreview ? (
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      sx={{ 
                        maxHeight: 150, 
                        maxWidth: '100%', 
                        objectFit: 'contain', 
                        borderRadius: 1,
                        boxShadow: 1
                      }}
                      alt="Prescription preview"
                    />
                    <IconButton 
                      sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.8)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowImageDialog(true);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                ) : (
                  <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                )}
                
                <Typography variant="h6" gutterBottom>
                  Drop prescription here or click to upload
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Supports PDF, JPG, PNG files up to 10MB
                </Typography>
                <Button
                  variant="contained"
                  disabled={uploading}
                >
                  Choose File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {uploadedFile && !uploading && (
                <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircle />}>
                  File uploaded successfully: <b>{uploadedFile.name}</b>
                </Alert>
              )}
              
              {/* Processing stages visualization */}
              {uploading && (
                <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.paper' }} elevation={0} variant="outlined">
                  <Typography variant="subtitle1" gutterBottom>
                    AI Processing Pipeline
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 8, borderRadius: 2 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {uploadProgress}% complete
                    </Typography>
                  </Box>
                  
                  {/* Processing stages */}
                  <Stepper activeStep={currentStage} orientation="vertical" sx={{ mt: 2 }}>
                    {processingStages.map((stage, index) => (
                      <Step key={stage.name} completed={stage.complete}>
                        <StepLabel
                          StepIconProps={{ 
                            icon: stage.complete ? <CheckCircle color="success" /> : index === currentStage ? 
                              <CircularProgress size={24} variant="determinate" value={stage.progress} /> : 
                              stage.icon 
                          }}
                        >
                          <Typography variant="body2" fontWeight={index === currentStage ? 'bold' : 'normal'}>
                            {stage.name}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Processing Results */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Psychology sx={{ mr: 1, color: 'success.main' }} />
                  AI Processing Results
                </Typography>
                
                {extractedData && (
                  <Button
                    startIcon={isEditing ? <Save /> : <Edit />}
                    color={isEditing ? 'success' : 'primary'}
                    variant={isEditing ? 'contained' : 'outlined'}
                    size="small"
                    onClick={toggleEdit}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Data'}
                  </Button>
                )}
              </Box>
              
              {extractedData && editedData ? (
                <Box>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Prescription processed successfully!
                    </Typography>
                    <Typography variant="caption">
                      Our AI has extracted key information from the prescription. You can review and edit before generating a diet plan.
                    </Typography>
                  </Alert>
                  
                  {/* Patient Information */}
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">Patient Information</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Patient Name"
                            fullWidth
                            size="small"
                            disabled={!isEditing}
                            value={editedData.patientName}
                            onChange={(e) => handleEditField('patientName', e.target.value)}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Age"
                            fullWidth
                            size="small"
                            type="number"
                            disabled={!isEditing}
                            value={editedData.age}
                            onChange={(e) => handleEditField('age', parseInt(e.target.value))}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Gender"
                            fullWidth
                            size="small"
                            select
                            disabled={!isEditing}
                            value={editedData.gender}
                            onChange={(e) => handleEditField('gender', e.target.value)}
                            SelectProps={{ native: true }}
                            sx={{ mb: 2 }}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Dosha Type"
                            fullWidth
                            size="small"
                            select
                            disabled={!isEditing}
                            value={editedData.dosha}
                            onChange={(e) => handleEditField('dosha', e.target.value)}
                            SelectProps={{ native: true }}
                            sx={{ mb: 2 }}
                          >
                            <option value="Vata">Vata</option>
                            <option value="Pitta">Pitta</option>
                            <option value="Kapha">Kapha</option>
                            <option value="Vata-Pitta">Vata-Pitta</option>
                            <option value="Vata-Kapha">Vata-Kapha</option>
                            <option value="Pitta-Kapha">Pitta-Kapha</option>
                            <option value="Tridosha">Tridosha</option>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Medical Condition"
                            fullWidth
                            size="small"
                            disabled={!isEditing}
                            value={editedData.disease}
                            onChange={(e) => handleEditField('disease', e.target.value)}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  
                  {/* Allergies Section */}
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NoFood sx={{ mr: 1, color: 'error.main' }} />
                        <Typography variant="subtitle1">Allergies & Restrictions</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {editedData.allergies.map((allergy, index) => (
                            <Chip
                              key={index}
                              label={allergy}
                              color="error"
                              size="small"
                              onDelete={isEditing ? () => removeAllergy(index) : undefined}
                            />
                          ))}
                        </Box>
                        
                        {isEditing && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                              size="small"
                              label="Add allergy"
                              value={newAllergy}
                              onChange={(e) => setNewAllergy(e.target.value)}
                              placeholder="e.g., Dairy, Gluten"
                              fullWidth
                            />
                            <IconButton color="primary" onClick={addAllergy} disabled={!newAllergy.trim()}>
                              <Add />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                  
                  {/* Recommended Foods */}
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Restaurant sx={{ mr: 1, color: 'success.main' }} />
                        <Typography variant="subtitle1">Recommended Foods</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {editedData.foods.map((food, index) => (
                            <Chip
                              key={index}
                              label={food}
                              color="success"
                              size="small"
                              onDelete={isEditing ? () => removeFood(index) : undefined}
                            />
                          ))}
                        </Box>
                        
                        {isEditing && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                              size="small"
                              label="Add food item"
                              value={newFood}
                              onChange={(e) => setNewFood(e.target.value)}
                              placeholder="e.g., Spinach, Quinoa"
                              fullWidth
                            />
                            <IconButton color="primary" onClick={addFood} disabled={!newFood.trim()}>
                              <Add />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={generateDietPlan}
                    sx={{ mt: 2 }}
                    startIcon={<Timeline />}
                    color="success"
                    size="large"
                  >
                    Generate AI Diet Plan
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Psychology sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Prescription Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload a prescription to see AI processing results
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Image Preview Dialog */}
      <Dialog 
        open={showImageDialog} 
        onClose={() => setShowImageDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Prescription Image
          <IconButton 
            onClick={() => setShowImageDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Cancel />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {imagePreview && (
            <Box 
              component="img" 
              src={imagePreview} 
              sx={{ 
                width: '100%', 
                maxHeight: '70vh', 
                objectFit: 'contain' 
              }} 
              alt="Prescription" 
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImageDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrescriptionUpload;
