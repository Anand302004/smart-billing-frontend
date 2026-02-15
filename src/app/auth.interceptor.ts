import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpServicesService } from './http-services.service';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(HttpServicesService);

  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(

    catchError((error) => {

      // ✅ silently handle expired token
      if (error.status === 401 && !isRefreshing) {

        isRefreshing = true;

        return authService.refreshToken().pipe(

          switchMap((res:any) => {

            isRefreshing = false;

            localStorage.setItem('token', res.accessToken);

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`
              }
            });

            // 🔥 retry without throwing error
            return next(retryReq);
          }),

          catchError(err => {
            isRefreshing = false;

            localStorage.clear();
            window.location.href = '/login';

            return throwError(() => err);
          })
        );
      }

      // ❌ don't spam console
      if (error.status === 401) {
        return throwError(() => null);
      }

      return throwError(() => error);
    })
  );
};
