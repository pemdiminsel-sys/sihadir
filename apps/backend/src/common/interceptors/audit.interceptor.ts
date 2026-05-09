import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, ip } = request;

    return next.handle().pipe(
      tap(async (data) => {
        if (['POST', 'PATCH', 'DELETE'].includes(method)) {
          try {
            // Extract entity and action from URL
            const urlParts = url.split('/');
            const entity = urlParts[2] || 'unknown';
            const entityId = urlParts[3] || (data?.id ? String(data.id) : null);

            await this.prisma.auditLog.create({
              data: {
                userId: user?.userId || null,
                action: method,
                entity: entity,
                entityId: entityId,
                details: {
                  url,
                  body: this.sanitizeBody(body),
                  response: data ? { id: data.id } : null,
                },
                ipAddress: ip,
              },
            });
          } catch (error) {
            this.logger.error(`Failed to create audit log: ${error.message}`);
          }
        }
      }),
    );
  }

  private sanitizeBody(body: any) {
    if (!body) return null;
    const sanitized = { ...body };
    delete sanitized.password;
    delete sanitized.token;
    return sanitized;
  }
}
