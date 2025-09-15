
import React, { useMemo } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { FoodItem } from '../../types';

interface FoodAnalyticsProps {
  foods: FoodItem[];
}

const FoodAnalytics: React.FC<FoodAnalyticsProps> = ({ foods }) => {

    const categoryDistribution = useMemo(() => {
        const dist = foods.reduce((acc: { [key: string]: number }, food) => {
            acc[food.category] = (acc[food.category] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    }, [foods]);

    const doshaBalancingStats = useMemo(() => {
        const stats = {
            Vata: { pacifying: 0, aggravating: 0 },
            Pitta: { pacifying: 0, aggravating: 0 },
            Kapha: { pacifying: 0, aggravating: 0 },
        };
        foods.forEach(food => {
            if (food.ayurvedicProperties.doshaImpact.vata > 0) stats.Vata.pacifying++;
            if (food.ayurvedicProperties.doshaImpact.vata < 0) stats.Vata.aggravating++;
            if (food.ayurvedicProperties.doshaImpact.pitta > 0) stats.Pitta.pacifying++;
            if (food.ayurvedicProperties.doshaImpact.pitta < 0) stats.Pitta.aggravating++;
            if (food.ayurvedicProperties.doshaImpact.kapha > 0) stats.Kapha.pacifying++;
            if (food.ayurvedicProperties.doshaImpact.kapha < 0) stats.Kapha.aggravating++;
        });

        return [
            { subject: 'Vata', A: stats.Vata.pacifying, B: stats.Vata.aggravating, fullMark: foods.length },
            { subject: 'Pitta', A: stats.Pitta.pacifying, B: stats.Pitta.aggravating, fullMark: foods.length },
            { subject: 'Kapha', A: stats.Kapha.pacifying, B: stats.Kapha.aggravating, fullMark: foods.length },
        ];
    }, [foods]);


  return (
    <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>Food Categories</Typography>
                    <Box sx={{height: 300}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" name="Number of items"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
         <Grid item xs={12} md={6}>
            <Card variant="outlined">
                <CardContent>
                     <Typography variant="h6" gutterBottom>Dosha Balancing Overview</Typography>
                     <Box sx={{height: 300}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={doshaBalancingStats}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, foods.length]}/>
                                <Radar name="Pacifying" dataKey="A" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                <Radar name="Aggravating" dataKey="B" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                                <Tooltip />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
  );
};

export default FoodAnalytics;
