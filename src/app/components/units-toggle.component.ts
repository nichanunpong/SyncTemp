import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitsService } from '../services/units.service';
import { ButtonComponent } from './ui/button.component';

@Component({
  selector: 'app-units-toggle',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <app-button variant="outline" size="sm" className="font-mono" (click)="toggleUnits()">
      {{ unitsService.tempUnit }}
    </app-button>
  `,
  styles: [],
})
export class UnitsToggleComponent {
  constructor(public unitsService: UnitsService) {}

  toggleUnits(): void {
    this.unitsService.toggleUnits();
  }
}
