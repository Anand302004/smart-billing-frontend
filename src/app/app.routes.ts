import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent as AdminDashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardComponent as UserDashboardComponent  } from './users/dashboard/dashboard.component';
import { AdminPanalComponent } from './admin/admin-panal/admin-panal.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { UserPanelComponent } from './users/userpanel/userpanel.component';
import { UsersComponent } from './pages/users/users.component';
// import { AddProductsComponent } from './users/add-products/add-products.component';
import { ProductsListComponent } from './users/products-list/products-list.component';
import { BillingComponent } from './users/billing/billing.component';
import { BillingPrintComponent } from './users/billing-print/billing-print.component';
import { BillingHistoryComponent } from './users/billing-history/billing-history.component';
import { SalesComponent } from './users/sales/sales.component';
import { SubscriptionAprovalComponent } from './pages/subscription-aproval/subscription-aproval.component';
import { SubscriptionUsersComponent } from './pages/subscription-users/subscription-users.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup',component: SignupComponent},
    { path: 'forget-password', component: ForgetPasswordComponent},


    {
  path: 'users',
  component: UserPanelComponent,
  canActivate: [AuthGuard],
  data: { role: 'user' },
  children: [
    { path:'dashboard', component:UserDashboardComponent },
    { path:'products',component:ProductsListComponent },
    { path:'billing',component:BillingComponent },
    { path:'billing/history',component:BillingHistoryComponent },
    { path:'billing/print/:billId', component: BillingPrintComponent },
    { path:'sales', component: SalesComponent },
    { path:'userPrivacy',component:PrivacyComponent }
  ]
},


   {
  path:'admin',
  component:AdminPanalComponent,
  canActivate: [AuthGuard],
  data: { role: 'admin' },
  children:[
    { path:'dashboard', component: AdminDashboardComponent },
    { path:'users', component:UsersComponent },
    { path:'subscription-aproval',component:SubscriptionAprovalComponent },
    { path:'subscription-users', component:SubscriptionUsersComponent },
    { path:'privacy', component:PrivacyComponent }
  ]
}

];
