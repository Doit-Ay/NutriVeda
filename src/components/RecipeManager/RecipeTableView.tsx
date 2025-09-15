
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Paper,
    Box,
    Typography,
    Chip,
    Tooltip,
    IconButton,
    LinearProgress,
    Collapse,
    Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Visibility,
    Edit,
    Delete,
    RestaurantMenu,
    Timer,
    KeyboardArrowDown,
    KeyboardArrowUp,
    AccessTime,
    HealthAndSafety,
    Favorite,
    FavoriteBorder,
} from '@mui/icons-material';
import { Recipe } from '../../types';

interface RecipeTableViewProps {
    recipes: Recipe[];
    onView: (recipe: Recipe) => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (recipe: Recipe) => void;
    onFavorite: (recipeId: string) => void;
}


// Type for sort direction
type Order = 'asc' | 'desc';

// Type for sortable column ids
type SortableColumn = 'name' | 'mealType' | 'time' | 'servings';

interface ExpandableRowProps {
    recipe: Recipe;
    onView: (recipe: Recipe) => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (recipe: Recipe) => void;
    onFavorite: (recipeId: string) => void;
}

const ExpandableRow: React.FC<ExpandableRowProps> = ({ recipe, onView, onEdit, onDelete, onFavorite }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // Get meal type chip color
    const getMealTypeColor = () => {
        switch(recipe.mealType.toLowerCase()) {
            case 'breakfast': return 'info';
            case 'lunch': return 'warning';
            case 'dinner': return 'secondary';
            case 'snack': return 'success';
            default: return 'default';
        }
    };

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: open ? 0 : 'inherit' } }} hover>
                <TableCell padding="checkbox">
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Typography variant="subtitle2">{recipe.name}</Typography>
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {recipe.description}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Chip 
                        label={recipe.mealType} 
                        size="small" 
                        color={getMealTypeColor()}
                        sx={{ fontWeight: 500 }}
                    />
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Timer fontSize="small" color="action" />
                        <Typography variant="body2">{recipe.prepTime + recipe.cookTime} min</Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <RestaurantMenu fontSize="small" color="action" />
                        <Typography variant="body2">{recipe.servings}</Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {recipe.ayurvedicDosha.vata && <Tooltip title="Good for Vata"><Chip label="V" size="small" color="info"/></Tooltip>}
                        {recipe.ayurvedicDosha.pitta && <Tooltip title="Good for Pitta"><Chip label="P" size="small" color="warning"/></Tooltip>}
                        {recipe.ayurvedicDosha.kapha && <Tooltip title="Good for Kapha"><Chip label="K" size="small" color="success"/></Tooltip>}
                    </Box>
                </TableCell>
                <TableCell>
                    <Box>
                        <Tooltip title={recipe.isFavorite ? "Remove from favorites" : "Add to favorites"}>
                            <IconButton 
                                size="small" 
                                onClick={() => onFavorite(recipe.id)} 
                                color={recipe.isFavorite ? "warning" : "default"}
                            >
                                {recipe.isFavorite ? <Favorite /> : <FavoriteBorder />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Recipe"><IconButton size="small" onClick={() => navigate(`/recipes/${recipe.id}`)} color="primary"><Visibility /></IconButton></Tooltip>
                        <Tooltip title="Edit Recipe"><IconButton size="small" onClick={() => onEdit(recipe)}><Edit /></IconButton></Tooltip>
                        <Tooltip title="Delete Recipe"><IconButton size="small" onClick={() => onDelete(recipe)} color="error"><Delete /></IconButton></Tooltip>
                    </Box>
                </TableCell>
            </TableRow>
            
            <TableRow>
                <TableCell sx={{ py: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2, px: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        <AccessTime fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                                        Preparation Details
                                    </Typography>
                                    <Box sx={{ ml: 3 }}>
                                        <Typography variant="body2">Prep Time: {recipe.prepTime} min</Typography>
                                        <Typography variant="body2">Cook Time: {recipe.cookTime} min</Typography>
                                        <Typography variant="body2" fontWeight={500}>Total: {recipe.prepTime + recipe.cookTime} min</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        <HealthAndSafety fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                                        Health Benefits
                                    </Typography>
                                    <Box sx={{ ml: 3 }}>
                                        {recipe.healthBenefits.length > 0 ? (
                                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                                                {recipe.healthBenefits.map((benefit, index) => (
                                                    <li key={index}>
                                                        <Typography variant="body2">{benefit}</Typography>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">No specific health benefits listed</Typography>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Ayurvedic Properties
                                    </Typography>
                                    <Box sx={{ ml: 3 }}>
                                        <Typography variant="body2">Taste (Rasa): {recipe.ayurvedicProperties.rasa.join(', ')}</Typography>
                                        <Typography variant="body2">Qualities (Guna): {recipe.ayurvedicProperties.guna.join(', ')}</Typography>
                                        <Typography variant="body2">Energy (Virya): {recipe.ayurvedicProperties.virya}</Typography>
                                        <Typography variant="body2">Post-digestive (Vipaka): {recipe.ayurvedicProperties.vipaka}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const RecipeTableView: React.FC<RecipeTableViewProps> = ({ recipes, onView, onEdit, onDelete, onFavorite }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<SortableColumn>('name');

    // Handle sort request
    const handleRequestSort = (property: SortableColumn) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Handle page change
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Sort function
    const sortRecipes = (a: Recipe, b: Recipe, orderBy: SortableColumn) => {
        switch (orderBy) {
            case 'name':
                return order === 'asc' 
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            case 'mealType':
                return order === 'asc' 
                    ? a.mealType.localeCompare(b.mealType)
                    : b.mealType.localeCompare(a.mealType);
            case 'time':
                const timeA = a.prepTime + a.cookTime;
                const timeB = b.prepTime + b.cookTime;
                return order === 'asc' ? timeA - timeB : timeB - timeA;
            case 'servings':
                return order === 'asc' ? a.servings - b.servings : b.servings - a.servings;
            default:
                return 0;
        }
    };

    // Sort recipes
    const sortedRecipes = [...recipes].sort((a, b) => sortRecipes(a, b, orderBy));

    // Get paginated recipes
    const paginatedRecipes = sortedRecipes.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer 
                component={Paper} 
                variant="outlined" 
                sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                    overflow: 'auto'
                }}
            >
                <Table sx={{ minWidth: 800 }}>
                    <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                            <TableCell padding="checkbox" width={40} />
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Recipe
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'mealType'}
                                    direction={orderBy === 'mealType' ? order : 'asc'}
                                    onClick={() => handleRequestSort('mealType')}
                                >
                                    Meal Type
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'time'}
                                    direction={orderBy === 'time' ? order : 'asc'}
                                    onClick={() => handleRequestSort('time')}
                                >
                                    Time
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'servings'}
                                    direction={orderBy === 'servings' ? order : 'asc'}
                                    onClick={() => handleRequestSort('servings')}
                                >
                                    Servings
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Dosha Balance</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRecipes.length > 0 ? (
                            paginatedRecipes.map((recipe) => (
                                <ExpandableRow 
                                    key={recipe.id} 
                                    recipe={recipe}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onFavorite={onFavorite}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        No recipes found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Try adjusting your filters or search term
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={recipes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ 
                    borderBottom: 'none',
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        fontSize: '0.875rem',
                    }
                }}
            />
        </Box>
    );
};

export default RecipeTableView;
