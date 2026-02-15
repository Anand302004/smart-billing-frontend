import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: spy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login if no token', () => {
    localStorage.removeItem('token');
    const canActivate = guard.canActivate({ data: {} } as any, {} as any);
    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow route if token exists and role matches', () => {
    localStorage.setItem('token', '123');
    localStorage.setItem('role', 'admin');
    const canActivate = guard.canActivate({ data: { role: 'admin' } } as any, {} as any);
    expect(canActivate).toBeTrue();
  });

  it('should redirect if role mismatch', () => {
    localStorage.setItem('token', '123');
    localStorage.setItem('role', 'user');
    const canActivate = guard.canActivate({ data: { role: 'admin' } } as any, {} as any);
    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
