import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {Button} from 'primeng/button';
import { PostsTableComponent } from './views/posts-table/posts-table.component';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PostFormComponent } from './views/post-form/post-form.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PostsTableComponent,
    PostFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Button,
    HttpClientModule,
    GraphQLModule,
    TableModule,
    ProgressSpinnerModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
    FloatLabelModule,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimationsAsync(),
      providePrimeNG({
          theme: {
              preset: Aura
          }
      }),
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
