import { inject } from '@angular/core';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { JwtService } from '../services/jwt.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authTokens = inject(JwtService).getToken();
  const isApiRequest = req.url.startsWith('/api');

  if (authTokens && isApiRequest) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authTokens.token}`
      }
    });

    return next(newReq);
  }

  return next(req);
};