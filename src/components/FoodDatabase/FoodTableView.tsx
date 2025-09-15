import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Chip,
  TablePagination,
  TableSortLabel,
  Typography,
  Collapse,
  Grid
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility, 
  KeyboardArrowUp, 
  KeyboardArrowDown,
  LocalFireDepartment as CalorieIcon,
  Egg as ProteinIcon,
  Grain as CarbsIcon,
  Water as FatsIcon
} from '@mui/icons-material';
import { FoodItem } from '../../types';

interface FoodTableViewProps {
  foods: FoodItem[];
  onView: (food: FoodItem) => void;
  onEdit: (food: FoodItem) => void;
  onDelete: (food: FoodItem) => void;
}

type Order = 'asc' | 'desc';
type SortKey = 'name' | 'category' | 'calories' | 'protein' | 'carbs' | 'fats';

const getQualityColor = (quality: string): "default" | "info" | "warning" | "error" | "secondary" | "primary" | "success" => {
  const colors: {[key: string]: "default" | "info" | "warning" | "error" | "secondary" | "primary" | "success"} = {
    light: 'info',
    dry: 'warning',
    hot: 'error',
    sharp: 'secondary',
    oily: 'success',
    cold: 'primary',
    heavy: 'default',
    liquid: 'info',
    soft: 'secondary',
    dense: 'primary',
    gross: 'warning',
    subtle: 'default',
    static: 'primary',
    mobile: 'success'
  }
  return colors[quality.toLowerCase()] || 'default';
};

const FoodTableView: React.FC<FoodTableViewProps> = ({ foods, onView, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<SortKey>('name');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: SortKey) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  
  const sortedFoods = React.useMemo(() => {
    return [...foods].sort((a, b) => {
      let comparison = 0;
      switch (orderBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'calories':
          comparison = (a.calories || 0) - (b.calories || 0);
          break;
        case 'protein':
          comparison = (a.protein || 0) - (b.protein || 0);
          break;
        case 'carbs':
          comparison = (a.carbs || 0) - (b.carbs || 0);
          break;
        case 'fats':
          comparison = (a.fats || 0) - (b.fats || 0);
          break;
        default:
          comparison = 0;
      }
      return order === 'asc' ? comparison : -comparison;
    });
  }, [foods, order, orderBy]);

  const paginatedFoods = sortedFoods.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Define a more specific type for the icon to avoid JSX namespace errors
  type IconProps = React.ReactElement<{ fontSize?: string; sx?: { mr: number } }>;
  
  const NutrientDisplay = ({ value, label, icon }: { value: number, label: string, icon: IconProps }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
      {React.cloneElement(icon, { fontSize: 'small', sx: { mr: 0.5 } })}
      <Typography variant="body2">
        <strong>{value}</strong> {label}
      </Typography>
    </Box>
  );

  const renderDosha = (name: string, value: number) => {
    let color: "default" | "success" | "error" = "default";
    let effect = "Neutral for";
    
    if (value > 0) {
      color = "success";
      effect = "Pacifies";
    } else if (value < 0) {
      color = "error";
      effect = "Aggravates";
    }
    
    return (
      <Tooltip title={`${effect} ${name}`}>
        <Chip 
          label={`${name} ${value > 0 ? '+' : ''}${value}`}
          size="small"
          color={color}
          variant={value === 0 ? "outlined" : "filled"}
          sx={{ mr: 0.5, fontWeight: 500, fontSize: '0.7rem' }}
        />
      </Tooltip>
    );
  };

  return (
    <>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} size="medium" aria-label="food items table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.paper' }}>
              <TableCell sx={{ width: '50px' }} />
              <TableCell sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={() => handleRequestSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Taste (Rasa)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'calories'}
                  direction={orderBy === 'calories' ? order : 'asc'}
                  onClick={() => handleRequestSort('calories')}
                >
                  Calories
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFoods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No food items match your search criteria
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedFoods.map((food) => (
                <React.Fragment key={food.id}>
                  <TableRow 
                    hover
                    onClick={() => toggleRow(food.id)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      borderLeft: expandedRow === food.id ? 2 : 0,
                      borderLeftColor: 'primary.main'
                    }}
                  >
                    <TableCell>
                      <IconButton size="small" aria-label="expand row">
                        {expandedRow === food.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {food.name}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={food.category} 
                        size="small" 
                        variant="outlined" 
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {food.ayurvedicProperties.rasa.map(rasa => (
                          <Chip 
                            key={rasa} 
                            label={rasa} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalorieIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{food.calories}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onView(food); }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(food); }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(food); }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={expandedRow === food.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" gutterBottom component="div">
                                Nutritional Information
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
                                <NutrientDisplay 
                                  value={food.protein || 0} 
                                  label="g protein" 
                                  icon={<ProteinIcon color="success" />} 
                                />
                                <NutrientDisplay 
                                  value={food.carbs || 0} 
                                  label="g carbs" 
                                  icon={<CarbsIcon color="warning" />} 
                                />
                                <NutrientDisplay 
                                  value={food.fats || 0} 
                                  label="g fats" 
                                  icon={<FatsIcon color="info" />} 
                                />
                              </Box>
                              {food.description && (
                                <>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Description
                                  </Typography>
                                  <Typography variant="body2" paragraph>
                                    {food.description}
                                  </Typography>
                                </>
                              )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" gutterBottom>
                                Ayurvedic Properties
                              </Typography>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                  Qualities (Guna):
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {food.ayurvedicProperties.guna.map(guna => (
                                    <Chip 
                                      key={guna} 
                                      label={guna} 
                                      size="small" 
                                      color={getQualityColor(guna)} 
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                  Dosha Impact:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {renderDosha("Vata", food.ayurvedicProperties.doshaImpact.vata)}
                                  {renderDosha("Pitta", food.ayurvedicProperties.doshaImpact.pitta)}
                                  {renderDosha("Kapha", food.ayurvedicProperties.doshaImpact.kapha)}
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={foods.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ 
          borderRadius: 2,
          '.MuiTablePagination-toolbar': { 
            pl: 2 
          } 
        }}
      />
    </>
  );
};

export default FoodTableView;