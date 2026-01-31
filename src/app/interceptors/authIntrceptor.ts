import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth-service'; 
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);
    if (!isBrowser) {
        return next(req);
    }

    const authService = inject(AuthService);
    const token = authService.getToken();


    if (req.url.includes('/api/auth')) {
        return next(req);

    }
    else {
        if (token) {
            const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
            return next(cloned);
        }

        return next(req);
    }
};
