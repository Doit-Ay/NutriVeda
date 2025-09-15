
import React, { useState, useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { mockPatients } from '../../data/mockData';
import { Patient } from '../../types';
import PatientToolbar from './PatientToolbar';
import PatientCardView from './PatientCardView';
import PatientTableView from './PatientTableView';
import PatientDialog from './PatientDialog';
import PatientInsights from './PatientInsights/PatientInsights';

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
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDosha, setFilterDosha] = useState('all');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = (patient?: Patient) => {
    setSelectedPatient(patient || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const handleDelete = (patientToDelete: Patient) => {
    setPatients(patients.filter(patient => patient.id !== patientToDelete.id));
  }

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             patient.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDosha = filterDosha === 'all' || patient.constitutionalAnalysis.prakriti === filterDosha;
        return matchesSearch && matchesDosha;
    })
  }, [patients, searchTerm, filterDosha]);


  return (
    <Box>
      <PatientToolbar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        filterDosha={filterDosha} 
        onFilterDoshaChange={setFilterDosha} 
        onAddNew={() => handleOpenDialog()} 
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label={<Badge badgeContent={filteredPatients.length} color="primary">Card View</Badge>} />
          <Tab label={<Badge badgeContent={filteredPatients.length} color="primary">Table View</Badge>} />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      <TabPanel value={selectedTab} index={0}>
        <PatientCardView patients={filteredPatients} onView={handleOpenDialog} onEdit={handleOpenDialog} onDelete={handleDelete}/>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <PatientTableView patients={filteredPatients} onView={handleOpenDialog} onEdit={handleOpenDialog} onDelete={handleDelete}/>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <PatientInsights patients={patients} />
      </TabPanel>

      <PatientDialog open={openDialog} onClose={handleCloseDialog} patient={selectedPatient} />
    </Box>
  );
};

export default Patients;
