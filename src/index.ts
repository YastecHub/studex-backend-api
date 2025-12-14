import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { config } from './config';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import jobRoutes from './routes/jobRoutes';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const getServerUrl = () => {
  if (config.nodeEnv === 'production') {
    return 'https://studex-backend-api.onrender.com';
  }
  return `http://localhost:${config.port}`;
};

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StudEx API',
      version: '1.0.0',
      description: 'StudEx Backend API - Hackathon Project',
      contact: {
        name: 'StudEx Team',
      },
    },
    servers: [
      {
        url: getServerUrl(),
        description: config.nodeEnv === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme.',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint with responsive landing page
app.get('/', (req: Request, res: Response) => {
  res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>StudEx API</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;position:relative;overflow-x:hidden;padding:20px}.background-shapes{position:absolute;width:100%;height:100%;overflow:hidden;z-index:0}.shape{position:absolute;border-radius:50%;background:rgba(255,255,255,.1);animation:float 20s infinite ease-in-out}.shape:nth-child(1){width:300px;height:300px;top:-150px;left:-150px}.shape:nth-child(2){width:200px;height:200px;top:50%;right:-100px;animation-delay:2s}.shape:nth-child(3){width:150px;height:150px;bottom:-75px;left:30%;animation-delay:4s}@keyframes float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-30px) rotate(180deg)}}.container{position:relative;z-index:1;text-align:center;max-width:800px;width:100%;padding:40px 20px;background:rgba(255,255,255,.1);backdrop-filter:blur(10px);border-radius:30px;border:1px solid rgba(255,255,255,.2);box-shadow:0 20px 60px rgba(0,0,0,.3)}.logo{font-size:clamp(36px,8vw,60px);font-weight:800;margin-bottom:20px;background:linear-gradient(45deg,#fff,#f0f0f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.tagline{font-size:clamp(18px,4vw,24px);margin-bottom:30px;opacity:.9}.description{font-size:clamp(14px,2.5vw,16px);line-height:1.6;margin-bottom:40px;opacity:.8;padding:0 10px}.endpoints{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-top:40px}.endpoint-card{background:rgba(255,255,255,.15);padding:20px;border-radius:15px;border:1px solid rgba(255,255,255,.2);transition:all .3s ease;text-decoration:none;color:#fff;display:block}.endpoint-card:hover{background:rgba(255,255,255,.25);transform:translateY(-5px);box-shadow:0 10px 30px rgba(0,0,0,.2)}.endpoint-title{font-size:18px;font-weight:600;margin-bottom:8px}.endpoint-desc{font-size:14px;opacity:.8}.status{display:inline-flex;align-items:center;gap:8px;background:rgba(16,185,129,.2);padding:8px 16px;border-radius:20px;font-size:14px;margin-bottom:30px}.status-dot{width:8px;height:8px;background:#10b981;border-radius:50%;animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}.version{margin-top:30px;font-size:14px;opacity:.6}@media(max-width:640px){.endpoints{grid-template-columns:1fr;gap:12px}.container{padding:30px 15px;border-radius:20px}.status{font-size:12px;padding:6px 12px}}</style></head><body><div class="background-shapes"><div class="shape"></div><div class="shape"></div><div class="shape"></div></div><div class="container"><div class="logo">StudEx API</div><div class="tagline">Student Freelance Marketplace</div><div class="status"><span class="status-dot"></span><span>API is running</span></div><div class="description">Connect students with freelance opportunities. A complete backend API with authentication, job postings, service listings, and secure escrow payments.</div><div class="endpoints"><a href="/api-docs" class="endpoint-card"><div class="endpoint-title">📚 API Docs</div><div class="endpoint-desc">Interactive Swagger UI</div></a><a href="/health" class="endpoint-card"><div class="endpoint-title">💚 Health Check</div><div class="endpoint-desc">Server status</div></a><div class="endpoint-card"><div class="endpoint-title">🔐 Authentication</div><div class="endpoint-desc">/api/auth</div></div><div class="endpoint-card"><div class="endpoint-title">💼 Services</div><div class="endpoint-desc">/api/services</div></div><div class="endpoint-card"><div class="endpoint-title">📋 Jobs</div><div class="endpoint-desc">/api/jobs</div></div></div><div class="version">Version 1.0.0 • Built with Node.js, TypeScript & MongoDB</div></div></body></html>`);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/jobs', jobRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`\n🚀 Server running on http://localhost:${config.port}`);
      console.log(`📚 Swagger docs available at http://localhost:${config.port}/api-docs\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
