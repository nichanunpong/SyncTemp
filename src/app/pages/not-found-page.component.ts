import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../components/ui/button.component';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div
      class="min-h-screen bg-gradient-day dark:bg-gradient-night flex items-center justify-center"
    >
      <div class="text-center space-y-4 p-8">
        <h1 class="text-6xl font-bold text-primary">404</h1>
        <h2 class="text-2xl font-bold text-foreground">Page Not Found</h2>
        <p class="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <app-button [routerLink]="['/']"> Go Home </app-button>
      </div>
    </div>
  `,
  styles: [],
})
export class NotFoundPageComponent {}
