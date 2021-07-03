import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChannelComponentComponent } from './channel-component/channel-component.component';
import { GameComponent } from './game/game.component';
import { RouterModule } from '@angular/router';
import { ChannelsComponent } from './channels/channels.component';
import { GamesComponent } from './games/games.component';
import { ShowChanelComponent } from './show-chanel/show-chanel.component';
import { TwitchService } from './twitch.service';
import { MychannelsComponent } from './mychannels/mychannels.component';
import { MatIconModule } from '@angular/material/icon';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LogoComponent } from './logo/logo.component';
import { ModalComponent } from './modal/modal.component';
import { NavigatablelistDirective } from './navigatablelist.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingComponent } from './loading/loading.component';
import { LoadingService } from './loading/loading.service';
import { LoaderInterceptor } from './htttp.interceptor';
import { TestComponent } from './test/test.component';
import { OauthComponent } from './oauth/oauth.component';
import { ResizePipe } from './pipe/resize.pipe';
import { AuthGuardService } from './auth-guard.service';
import { TwEmbedComponent } from './show-chanel/tw-embed/tw-embed.component';
import { TwEmbedsComponent } from './show-chanel/tw-embeds/tw-embeds.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'mychannels', pathMatch: 'full' },
        { path: 'games', component: GamesComponent, canActivate: [AuthGuardService] },
        { path: 'channels', component: ChannelsComponent, canActivate: [AuthGuardService] },
        { path: 'channels/:id', component: ChannelsComponent, canActivate: [AuthGuardService] },
        { path: 'show/:id', component: ShowChanelComponent },
        { path: 'mychannels', component: MychannelsComponent, canActivate: [AuthGuardService] },
        { path: 'login', component: TestComponent },
        { path: 'oauth_redirect', component: OauthComponent },
        { path: 'embeds/:id', component: TwEmbedsComponent },
        { path: 'auto_redirect', redirectTo: 'mychannels', pathMatch: 'full' }
      ],
      { useHash: true }
    ),
    MatIconModule,
    MatProgressBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  declarations: [
    AppComponent,
    ChannelComponentComponent,
    GameComponent,
    ChannelsComponent,
    GamesComponent,
    ShowChanelComponent,
    MychannelsComponent,
    LogoComponent,
    ModalComponent,
    NavigatablelistDirective,
    LoadingComponent,
    TestComponent,
    OauthComponent,
    ResizePipe,
    TwEmbedComponent,
    TwEmbedsComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    TwitchService,
    LoadingService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ]
})
export class AppModule {
  constructor(twitch: TwitchService) {

    document.addEventListener('visibilitychange', e => {
      if (document.visibilityState === 'visible') {
        if (environment.production) {
          console.log('Refreshing favs if production ', environment.production);
          twitch.loadFavs();
        }
      }
    });
  }
}
