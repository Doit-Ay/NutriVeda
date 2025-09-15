# NutriVeda - Comprehensive Ayurvedic Diet Management Platform


[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Material UI](https://img.shields.io/badge/Material_UI-5.14.0-blue.svg)](https://mui.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Last Updated](https://img.shields.io/badge/Last_Updated-September_2025-green.svg)]()

## 🌟 Overview

NutriVeda is a comprehensive cloud-based practice management and nutrient analysis software specifically designed for Ayurvedic dietitians. It integrates modern nutritional metrics with traditional Ayurvedic principles, enabling practitioners to create, manage, and deliver personalized diet charts in digital form.

## 🎯 Key Features

### 1. **Food & Nutrient Database**
- **8,000+ food items** including Indian, multicultural, and global cuisines
- **Scientifically calculated nutrient values** (calories, macros, micros) customized for different genders and age groups
- **Comprehensive Ayurvedic categorization**:
  - Six tastes (Rasa)
  - Potency (Virya)
  - Post-digestive effect (Vipaka)
  - Qualitative properties (Guna)
  - Dosha impact analysis

### 2. **Automated Diet Chart Generation**
- **AI-powered diet plan creation** based on patient profiles
- **Dual compliance system** combining modern nutrition with Ayurvedic principles
- **Multiple output formats**: Weekly, monthly, and quarterly plans
- **3 daily meal options** (breakfast, lunch, dinner) with detailed nutritional analysis

### 3. **Patient Management System**
- **Comprehensive patient profiles** with:
  - Basic information (age, gender, weight, height)
  - Lifestyle habits (activity level, sleep, water intake)
  - Medical history and allergies
  - Ayurvedic assessments (Prakriti, Vikriti, Dosha imbalance)
- **Progress tracking** and consultation history
- **Digital health records** with secure data management

### 4. **Recipe-Based Planning**
- **Recipe management system** with automated nutrient analysis
- **Ayurvedic validation** for food combinations and preparation methods
- **Quick conversion** of recipes into diet charts
- **Cooking method recommendations** based on dosha balance

### 5. **Advanced Assessment Tools**
- **Comprehensive patient assessment** with step-by-step wizard
- **Dosha analysis** with interactive sliders and symptom tracking
- **Constitutional assessment** (Prakriti vs Vikriti)
- **Personalized recommendations** based on assessment results

### 6. **Mobile & Tablet Support**
- **Fully responsive design** for all devices
- **Dedicated patient mobile app** with:
  - Daily meal tracking
  - Water intake monitoring
  - Progress visualization
  - Push notifications
- **Offline access** with auto-sync capabilities

### 7. **Reporting & Analytics**
- **Comprehensive reporting system** with multiple templates:
  - Patient compliance reports
  - Diet effectiveness analysis
  - Nutritional analysis
  - Ayurvedic compliance tracking
- **Export capabilities** in PDF and Excel formats
- **Real-time dashboards** with key performance indicators

### 8. **Security & Compliance**
- **End-to-end encryption** for patient data
- **HIPAA/GDPR compliance** ready
- **Role-based access control**
- **Secure API endpoints**

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI) 5** for modern UI components
- **React Router v6** for navigation
- **Context API** for state management
- **Fetch API** for API calls

### Backend (Ready for Integration)
- **Node.js/Express** for REST API endpoints
- **PostgreSQL** for primary data storage
- **Redis** for caching and session management
- **JWT** for secure authentication

### AI/ML Integration
- **OCR processing** for prescription uploads
- **Natural language processing** for food extraction
- **Machine learning models** for diet plan optimization
- **Ayurvedic knowledge base** integration

## 📱 Mobile App Features

### Patient Mobile App
- **Dashboard** with daily overview
- **Meal tracking** with photo capture
- **Water intake monitoring**
- **Progress visualization** with charts
- **Push notifications** for meal reminders
- **Offline mode** with sync capabilities

### Practitioner Mobile App
- **Patient management** on the go
- **Quick diet plan generation**
- **Prescription processing**
- **Real-time notifications**

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm 9+ or yarn 1.22+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Doit-Ay/nutriveda.git

# Navigate to project directory
cd nutriveda

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Open http://localhost:3000 in your browser
```

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_OCR_API_KEY=your_ocr_api_key
REACT_APP_AI_API_KEY=your_ai_api_key
REACT_APP_STORAGE_URL=your_storage_url
REACT_APP_AUTH_DOMAIN=your_auth_domain
```

## 📊 Database Schema

### Core Entities
- **Patients**: Personal info, medical history, dosha analysis
- **Foods**: Nutritional data, Ayurvedic properties, dosha impact
- **Recipes**: Ingredients, instructions, nutritional analysis
- **Diet Plans**: Generated plans, compliance tracking
- **Assessments**: Patient evaluations, dosha analysis
- **Reports**: Generated reports, analytics data

### Key Relationships
- Patient → Diet Plans (One-to-Many)
- Diet Plan → Meals (One-to-Many)
- Meal → Foods (Many-to-Many)
- Recipe → Foods (Many-to-Many)
- Patient → Assessments (One-to-Many)

## 🎨 UI/UX Features

### Design Principles
- **Ayurvedic color scheme** with warm, natural tones
- **Intuitive navigation** with clear information hierarchy
- **Responsive design** for all screen sizes
- **Accessibility compliance** (WCAG 2.1)
- **Multi-language support** ready

### Key Components
- **Dashboard** with real-time statistics
- **Patient cards** with quick actions
- **Food database** with advanced filtering
- **Recipe builder** with step-by-step wizard
- **Assessment forms** with progress indicators
- **Report generator** with customizable templates

## 🔌 API Integration

### RESTful API Endpoints
- **Patient Management**: CRUD operations for patient data
- **Food Database**: Search, filter, and manage food items
- **Diet Plan Generation**: AI-powered plan creation
- **Assessment Tools**: Dosha analysis and recommendations
- **Reporting**: Generate and export reports
- **Analytics**: Compliance and effectiveness tracking

### Third-Party Integrations
- **OCR Services** for prescription processing
- **AI/ML APIs** for diet plan optimization
- **Payment Gateways** for subscription management
- **Email Services** for notifications
- **Cloud Storage** for file management

## 📈 Analytics & Reporting

### Key Metrics
- **Patient compliance rates** with visualization dashboards
- **Diet plan effectiveness** tracking over time
- **Nutritional analysis trends** with comparative insights
- **Ayurvedic compliance scores** with dosha balance tracking
- **Practitioner productivity** and patient outcome metrics

### Report Types
- **Patient Progress Reports** with customizable templates
- **Diet Effectiveness Analysis** with before/after comparisons
- **Nutritional Compliance Reports** with daily/weekly/monthly views
- **Ayurvedic Assessment Reports** with dosha evolution tracking
- **Custom Analytics Dashboards** with exportable insights

## 🔒 Security Features

### Data Protection
- **End-to-end encryption** for sensitive data
- **Secure authentication** with JWT tokens
- **Role-based access control**
- **Audit logging** for all actions
- **Data backup** and recovery

### Compliance
- **HIPAA compliance** for healthcare data
- **GDPR compliance** for EU users
- **SOC 2 Type II** certification ready
- **Regular security audits**

## 🚀 Deployment

### Production Build
```bash
# Create production build
npm run build

# Serve the build
npm install -g serve
serve -s build
```

### Docker Deployment
```bash
# Build Docker image
docker build -t nutriveda .

# Run container
docker run -p 3000:3000 nutriveda
```

### Cloud Deployment
- **AWS**: EC2, RDS, S3, CloudFront
- **Azure**: App Service, SQL Database, Blob Storage
- **Google Cloud**: Compute Engine, Cloud SQL, Storage

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- **TypeScript** with strict type checking
- **ESLint** with Airbnb configuration
- **Prettier** for consistent code formatting
- **Jest** and **React Testing Library** for unit and integration tests
- **Storybook** for component documentation and visual testing

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 NutriVeda Health Technologies

## 🆘 Support

### Documentation
- **API Documentation**: Available at `/api-docs`
- **User Guide**: Check the `/docs` folder
- **Video Tutorials**: Available on our YouTube channel

## 🔮 Roadmap

### Phase 1 (Completed Q3 2025)
- ✅ Core platform development
- ✅ Patient management system
- ✅ Food database integration
- ✅ Basic diet plan generation

### Phase 2 (Current - Q3 2025)
- ✅ AI-powered recommendations
- 🔄 Advanced analytics
- 🔄 Mobile app optimization
- 🔄 Third-party integrations

### Phase 3 (Q4 2025)
- 📋 Telemedicine integration
- 📋 Wearable device sync
- 📋 Advanced AI features
- 📋 Multi-tenant architecture

### Phase 4 (Q1 2026)
- 📋 Global expansion
- 📋 Advanced reporting
- 📋 Machine learning optimization
- 📋 Enterprise features

## 🙏 Acknowledgments

- **Ministry of Ayush, Government of India** for project support and guidance
- **All India Institute of Ayurveda (AIIA)** for domain expertise and content validation
- **Open source community** for amazing tools and libraries that made this project possible
- **Beta testers and early adopters** for valuable feedback and continued support
- **React and Material-UI teams** for providing excellent documentation and components

---

