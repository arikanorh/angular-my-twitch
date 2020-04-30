import { NgModule, OnInit } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { ChannelComponentComponent } from "./channel-component/channel-component.component";
import { GameComponent } from "./game/game.component";
import { RouterModule } from "@angular/router";
import { ChannelsComponent } from "./channels/channels.component";
import { GamesComponent } from "./games/games.component";
import { ShowChanelComponent } from "./show-chanel/show-chanel.component";
import { TwitchService } from "./twitch.service";
import { MychannelsComponent } from "./mychannels/mychannels.component";
import { NewChannelComponent } from "./channel-component/new-channel/new-channel.component";
import { MatIconModule } from "@angular/material/icon";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { LogoComponent } from "./logo/logo.component";
import { ModalComponent } from "./modal/modal.component";
import { NavigatablelistDirective } from "./navigatablelist.directive";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        { path: "", redirectTo: "mychannels", pathMatch: "full" },
        { path: "games", component: GamesComponent },
        { path: "channels", component: ChannelsComponent },
        { path: "channels/:id", component: ChannelsComponent },
        { path: "show/:id", component: ShowChanelComponent },
        { path: "mychannels", component: MychannelsComponent }
      ],
      { useHash: true }
    ),
    MatIconModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
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
    NewChannelComponent,
    LogoComponent,
    ModalComponent,
    NavigatablelistDirective
  ],
  bootstrap: [AppComponent],
  providers: [TwitchService]
})
export class AppModule {
  constructor(twitch: TwitchService) {
    twitch.loadFavs();

    document.addEventListener("visibilitychange", e => {
      if (document.visibilityState === "visible") {
        console.log("Refreshing favs if production ",environment.production);
        if (environment.production) {
          twitch.loadFavs();
        }
      }
    });
  }
}
