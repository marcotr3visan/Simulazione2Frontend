import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  // the router only cares about the *first* value that comes back; if we
  // leave the stream open the guard will never resolve. `take(1)` guarantees
  // the observable completes after emitting once.
  return authSrv.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      // not logged in → redirect to login with the requested URL
      if (!isAuthenticated) {
        return router.createUrlTree(
          ['/login'],
          { queryParams: { requestedUrl: state.url } }
        );
      }

      // if the route defines required roles, check whether the current user
      // has one of them.
      const requiredRoles: string[] = route.data?.['roles'] ?? [];
      if (requiredRoles.length) {
        const role = authSrv.getRole();
        if (!role || !requiredRoles.includes(role)) {
          // unauthorized – send back to login (or a dedicated "403" route if
          // you prefer)
          return router.createUrlTree(['/login']);
        }
      }

      // everything passed
      return true;
    })
  );
};
