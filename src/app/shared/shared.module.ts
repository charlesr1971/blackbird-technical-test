import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';

import { NameFormatPipe } from './pipes/name-format/name-format.pipe';

import { PageNotFoundComponent } from './components/';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    NameFormatPipe
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NameFormatPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
