
import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Tooltip,
    IconButton,
    CardMedia,
    CardActions,
    CircularProgress,
    LinearProgress,
    Badge,
    Divider,
    Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Visibility,
    Edit,
    Delete,
    Timer,
    RestaurantMenu,
    Favorite,
    FavoriteBorder,
    Star,
    StarBorder,
    LocalDining,
    AccessTime,
    Category,
    EmojiNature,
    Spa
} from '@mui/icons-material';
import { Recipe } from '../../types';

interface RecipeCardViewProps {
    recipes: Recipe[];
    onView: (recipe: Recipe) => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (recipe: Recipe) => void;
    onFavorite: (recipeId: string) => void;
}

const RecipeCard: React.FC<{ 
    recipe: Recipe, 
    onView: () => void, 
    onEdit: () => void, 
    onDelete: () => void,
    onFavorite: (recipeId: string) => void
}> = ({ recipe, onView, onEdit, onDelete, onFavorite }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isFavorite = recipe.isFavorite || false;
    const navigate = useNavigate();

    // Calculate color based on dosha balance
    const getDoshaColor = () => {
        if (recipe.ayurvedicDosha.vata && recipe.ayurvedicDosha.pitta && recipe.ayurvedicDosha.kapha) {
            return 'rgb(75, 192, 192, 0.8)'; // Teal for balanced
        } else if (recipe.ayurvedicDosha.vata && recipe.ayurvedicDosha.pitta) {
            return 'rgb(255, 159, 64, 0.8)'; // Orange
        } else if (recipe.ayurvedicDosha.vata && recipe.ayurvedicDosha.kapha) {
            return 'rgb(153, 102, 255, 0.8)'; // Purple
        } else if (recipe.ayurvedicDosha.pitta && recipe.ayurvedicDosha.kapha) {
            return 'rgb(54, 162, 235, 0.8)'; // Blue
        } else if (recipe.ayurvedicDosha.vata) {
            return 'rgb(255, 99, 132, 0.8)'; // Red
        } else if (recipe.ayurvedicDosha.pitta) {
            return 'rgb(255, 205, 86, 0.8)'; // Yellow
        } else if (recipe.ayurvedicDosha.kapha) {
            return 'rgb(75, 192, 192, 0.8)'; // Green
        }
        return 'rgba(201, 203, 207, 0.8)'; // Grey default
    };

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
    
    // Calculate dosha balance for progress bars
    const getDoshaBalance = () => {
        const vataPower = recipe.ayurvedicDosha.vata ? recipe.ayurvedicProperties.doshaImpact.vata * 20 : 0;
        const pittaPower = recipe.ayurvedicDosha.pitta ? recipe.ayurvedicProperties.doshaImpact.pitta * 20 : 0;
        const kaphaPower = recipe.ayurvedicDosha.kapha ? recipe.ayurvedicProperties.doshaImpact.kapha * 20 : 0;
        
        return { vata: vataPower, pitta: pittaPower, kapha: kaphaPower };
    };
    
    const doshaBalance = getDoshaBalance();
    
    // Extract difficulty level based on number of ingredients and instructions
    const getDifficultyLevel = () => {
        const ingredientsCount = recipe.ingredients.length;
        const instructionsCount = recipe.instructions.length;
        const totalComplexity = ingredientsCount + instructionsCount;
        
        if (totalComplexity > 12) return 'Advanced';
        if (totalComplexity > 8) return 'Intermediate';
        return 'Beginner';
    };
    
    // Get difficulty color
    const getDifficultyColor = () => {
        const difficulty = getDifficultyLevel();
        switch(difficulty) {
            case 'Advanced': return 'error';
            case 'Intermediate': return 'warning';
            case 'Beginner': return 'success';
            default: return 'default';
        }
    };
    
    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFavorite(recipe.id);
    };

    return (
        <Card 
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: isFavorite 
                    ? '0 6px 20px rgba(255,167,38,0.4)' 
                    : '0 6px 20px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: isFavorite 
                        ? '0 12px 28px rgba(255,167,38,0.5)' 
                        : '0 12px 28px rgba(0,0,0,0.15)',
                },
                position: 'relative',
                border: isFavorite ? '2px solid' : 'none',
                borderColor: isFavorite ? 'warning.main' : 'transparent',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
        >
            {/* Favorite Button - Absolute positioned */}
            <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                <IconButton 
                    size="small" 
                    onClick={toggleFavorite}
                    sx={{ 
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                        boxShadow: 2,
                        p: 0.5
                    }}
                >
                    {isFavorite ? (
                        <Favorite fontSize="small" color="warning" />
                    ) : (
                        <FavoriteBorder fontSize="small" color="action" />
                    )}
                </IconButton>
            </Box>

            {/* Difficulty level badge */}
            <Box 
                sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 2,
                    display: 'flex',
                    gap: 1
                }}
            >
                <Chip 
                    label={recipe.mealType} 
                    size="small" 
                    icon={<RestaurantMenu fontSize="small" />}
                    color={getMealTypeColor()}
                    sx={{ 
                        fontWeight: 600,
                        boxShadow: 2
                    }}
                />
                <Chip 
                    label={getDifficultyLevel()}
                    size="small"
                    icon={<AccessTime fontSize="small" />}
                    color={getDifficultyColor()}
                    sx={{ 
                        fontWeight: 600,
                        boxShadow: 2
                    }}
                />
            </Box>

            {/* Colored Header Instead of Image */}
            <Box
                sx={{
                    height: 120,
                    bgcolor: getDoshaColor(),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.5s',
                    transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                    position: 'relative'
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        color: '#fff',
                        fontWeight: 600,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        px: 2
                    }}
                >
                    {recipe.name}
                </Typography>
            </Box>
            
            {/* Dosha color strip */}
            <Box sx={{ display: 'flex', height: 6 }}>
                {recipe.ayurvedicDosha.vata && (
                    <Box sx={{ flexGrow: 1, bgcolor: 'info.main' }} />
                )}
                {recipe.ayurvedicDosha.pitta && (
                    <Box sx={{ flexGrow: 1, bgcolor: 'warning.main' }} />
                )}
                {recipe.ayurvedicDosha.kapha && (
                    <Box sx={{ flexGrow: 1, bgcolor: 'success.main' }} />
                )}
                {!recipe.ayurvedicDosha.vata && !recipe.ayurvedicDosha.pitta && !recipe.ayurvedicDosha.kapha && (
                    <Box sx={{ flexGrow: 1, bgcolor: 'grey.400' }} />
                )}
            </Box>

            <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
                <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <span>{recipe.name}</span>
                    
                    {/* Health benefits indicator */}
                    {recipe.healthBenefits && recipe.healthBenefits.length > 0 && (
                        <Tooltip title={`${recipe.healthBenefits.length} Health Benefits`}>
                            <Badge badgeContent={recipe.healthBenefits.length} color="secondary" max={9}>
                                <Spa fontSize="small" color="action" />
                            </Badge>
                        </Tooltip>
                    )}
                </Typography>

                {/* Description */}
                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                        mb: 2,
                        height: 54,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {recipe.description}
                </Typography>
                
                {/* Ingredients count */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <LocalDining fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                        {recipe.ingredients.length} ingredients
                    </Typography>
                </Box>
                
                {/* Dosha impact bars */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ minWidth: 45 }}>Vata</Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={doshaBalance.vata} 
                            color="info"
                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ minWidth: 45 }}>Pitta</Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={doshaBalance.pitta} 
                            color="warning"
                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ minWidth: 45 }}>Kapha</Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={doshaBalance.kapha} 
                            color="success"
                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                        />
                    </Box>
                </Box>
                
                {/* Recipe stats */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        pt: 1,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Timer fontSize="small" color="action" />
                        <Typography variant="body2">{recipe.prepTime + recipe.cookTime} min</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <RestaurantMenu fontSize="small" color="action" />
                        <Typography variant="body2">{recipe.servings} servings</Typography>
                    </Box>
                </Box>
            </CardContent>
            
            {/* Card actions */}
            <CardActions 
                sx={{ 
                    justifyContent: 'flex-end',
                    px: 2,
                    py: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'rgba(0,0,0,0.02)'
                }}
            >
                <Tooltip title="View Recipe">
                    <IconButton size="small" onClick={(e) => {e.stopPropagation(); onView();}} color="primary">
                        <Visibility />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit Recipe">
                    <IconButton size="small" onClick={(e) => {e.stopPropagation(); onEdit();}} color="info">
                        <Edit />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Recipe">
                    <IconButton size="small" onClick={(e) => {e.stopPropagation(); onDelete();}} color="error">
                        <Delete />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

const RecipeCardView: React.FC<RecipeCardViewProps> = ({ recipes, onView, onEdit, onDelete, onFavorite }) => {
    // Group recipes by meal type for better organization
    const recipesByMealType = React.useMemo(() => {
        const grouped = recipes.reduce((acc, recipe) => {
            if (!acc[recipe.mealType]) {
                acc[recipe.mealType] = [];
            }
            acc[recipe.mealType].push(recipe);
            return acc;
        }, {} as Record<string, Recipe[]>);
        
        // Sort the meal types in a logical order
        const mealTypeOrder = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
        return Object.entries(grouped)
            .sort(([a], [b]) => 
                mealTypeOrder.indexOf(a) - mealTypeOrder.indexOf(b)
            );
    }, [recipes]);
    
    // Get the icon for each meal type
    const getMealTypeIcon = (mealType: string) => {
        switch(mealType) {
            case 'Breakfast': return '🍳';
            case 'Lunch': return '🍲';
            case 'Dinner': return '🍽️';
            case 'Snack': return '🥨';
            default: return '🍴';
        }
    };
    
    return (
        <Box>
            {recipes.length === 0 ? (
                <Box sx={{ 
                    textAlign: 'center', 
                    py: 10, 
                    px: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: 2 
                }}>
                    <RestaurantMenu sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        No recipes match your search criteria
                    </Typography>
                    <Typography variant="body1" color="text.secondary" maxWidth="500px">
                        Try adjusting your filters or search term, or add a new recipe to get started.
                    </Typography>
                </Box>
            ) : (
                <Box>
                    {recipesByMealType.map(([mealType, mealRecipes], mealTypeIndex) => (
                        <Box key={mealType} sx={{ mb: 5 }}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 2,
                                    pb: 1,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography 
                                    variant="h5" 
                                    component="h2" 
                                    sx={{ 
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <span role="img" aria-label={mealType}>{getMealTypeIcon(mealType)}</span>
                                    {mealType}
                                    <Chip 
                                        label={mealRecipes.length} 
                                        color="primary" 
                                        size="small" 
                                        sx={{ ml: 1 }} 
                                    />
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {mealRecipes.map((recipe, index) => (
                                    <Grid 
                                        item 
                                        xs={12} 
                                        sm={6} 
                                        md={4} 
                                        lg={3} 
                                        key={recipe.id}
                                        sx={{ 
                                            animation: 'fadeIn 0.5s ease-out',
                                            animationDelay: `${index * 0.1}s`,
                                            '@keyframes fadeIn': {
                                                '0%': {
                                                    opacity: 0,
                                                    transform: 'translateY(20px)'
                                                },
                                                '100%': {
                                                    opacity: 1,
                                                    transform: 'translateY(0)'
                                                }
                                            }
                                        }}
                                    >
                                        <RecipeCard 
                                            recipe={recipe} 
                                            onView={() => onView(recipe)}
                                            onEdit={() => onEdit(recipe)}
                                            onDelete={() => onDelete(recipe)}
                                            onFavorite={onFavorite}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default RecipeCardView;
