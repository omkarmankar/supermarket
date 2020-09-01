import { NgModule } from '@angular/core';
import { LoginComponent} from './login/login.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { routes } from './authentication.routing';
import { RouterModule } from '@angular/router';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';

//Google authentication
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("761475953509-hpi1momshn1qfkbrulv48kpackm7glgb.apps.googleusercontent.com")
  }
]);
export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    LoginComponent
  ],
  providers: [
  {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }
]
})
export class AuthenticationModule { }
