import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { ButtonComponent } from './ui/button.component';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <app-button variant="outline" size="icon" className="rounded-full" (click)="toggleTheme()">
      @if (themeService.theme() === 'light') {
      <span>🌙</span>
      } @else {
      <span>☀️</span>
      }
      <span class="sr-only">Toggle theme</span>
    </app-button>
  `,
  styles: [],
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
