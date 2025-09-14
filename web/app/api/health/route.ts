import { NextRequest, NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version?: string;
  checks: {
    server: 'up' | 'down';
    memory: 'healthy' | 'warning' | 'critical';
    dependencies: 'connected' | 'disconnected';
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const startTime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const memoryUsageInMB = memoryUsage.heapUsed / 1024 / 1024;

    // Environment-aware memory thresholds
    const isDevelopment = process.env.NODE_ENV === 'development';
    const warningThreshold = isDevelopment ? 500 : 150;
    const criticalThreshold = isDevelopment ? 1000 : 300;

    // Memory health check
    let memoryStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (memoryUsageInMB > criticalThreshold) {
      memoryStatus = 'critical';
    } else if (memoryUsageInMB > warningThreshold) {
      memoryStatus = 'warning';
    }

    // Check if backend API is accessible (optional)
    let dependenciesStatus: 'connected' | 'disconnected' = 'connected';
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

      if (backendUrl) {
        const response = await fetch(`${backendUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) {
          dependenciesStatus = 'disconnected';
        }
      }
    } catch (error) {
      dependenciesStatus = 'disconnected';
    }

    const healthStatus: HealthStatus = {
      status:
        memoryStatus === 'critical' || dependenciesStatus === 'disconnected'
          ? 'unhealthy'
          : 'healthy',
      timestamp: new Date().toISOString(),
      uptime: startTime,
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version,
      checks: {
        server: 'up',
        memory: memoryStatus,
        dependencies: dependenciesStatus,
      },
    };

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

// Add HEAD method for simple health checks
export async function HEAD(): Promise<NextResponse> {
  return new NextResponse(null, { status: 200 });
}
