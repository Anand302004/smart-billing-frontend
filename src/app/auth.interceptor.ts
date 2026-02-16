import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpServicesService } from './http-services.service';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(HttpServicesService);
  const token = localStorage.getItem('token');

  // ✅ attach token
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(

    catchError((error) => {

      /* ===============================
         🚫 APIs where refresh NOT allowed
      =============================== */

      const skipRefresh =
        req.url.includes('/login') ||
        req.url.includes('/signup') ||
        req.url.includes('/update');

      // ✅ only refresh when real auth failure
      if (error.status === 401 && !isRefreshing && !skipRefresh) {

        isRefreshing = true;

        return authService.refreshToken().pipe(

          switchMap((res: any) => {

            isRefreshing = false;

            localStorage.setItem('token', res.accessToken);

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`
              }
            });

            return next(retryReq);
          }),

          catchError(err => {

            isRefreshing = false;

            // ✅ real session expired
            localStorage.clear();
            window.location.href = '/login';

            return throwError(() => err);
          })
        );
      }

      // ✅ normal error pass
      return throwError(() => error);
    })
  );
};
