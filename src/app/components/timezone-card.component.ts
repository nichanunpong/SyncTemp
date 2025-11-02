import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './ui/card.component';

@Component({
  selector: 'app-timezone-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card className="p-6 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-soft">
      <div class="space-y-4">
        <div class="flex items-center justify-center space-x-2 text-muted-foreground">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span class="text-sm font-medium">Local Time</span>
        </div>

        <div class="text-center">
          <div class="text-5xl font-bold text-primary mb-2 font-mono">
            {{ formatTime() }}
          </div>
          <div class="text-sm text-muted-foreground mb-4">
            {{ formatDate() }}
          </div>
        </div>

        <div class="pt-4 border-t border-border/50 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-muted-foreground">Time Zone</span>
            <span class="text-sm font-medium text-card-foreground">
              {{ timezone }}
            </span>
          </div>
          @if (utcOffset) {
          <div class="flex justify-between items-center">
            <span class="text-sm text-muted-foreground">UTC Offset</span>
            <span class="text-sm font-medium text-card-foreground">
              {{ utcOffset }}
            </span>
          </div>
          }
        </div>
      </div>
    </app-card>
  `,
  styles: [],
})
export class TimezoneCardComponent implements OnInit, OnDestroy {
  @Input() timezone!: string;
  @Input() utcOffset?: string;

  time = signal(new Date());
  private intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.time.set(new Date());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  formatTime(): string {
    return this.time().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  formatDate(): string {
    return this.time().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
