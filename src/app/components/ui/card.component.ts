import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/utils';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)">
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
})
export class CardComponent {
  @Input() className: string = '';
  cn = cn;
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cn('flex flex-col space-y-1.5 p-6', className)">
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
})
export class CardHeaderComponent {
  @Input() className: string = '';
  cn = cn;
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cn('p-6 pt-0', className)">
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
})
export class CardContentComponent {
  @Input() className: string = '';
  cn = cn;
}
