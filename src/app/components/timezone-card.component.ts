import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './ui/card.component';

@Component({
  selector: 'app-timezone-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card
      className="p-6 bg-gradient-card backdrop-blur-sm border-primary/20 shadow-glow h-full flex flex-col"
    >
      <div class="text-center space-y-4 flex-1 flex flex-col">
        <div class="flex items-center justify-center space-x-2 text-muted-foreground">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 class="text-2xl font-bold text-card-foreground">Local Time</h2>
        </div>

        <div class="py-6">
          <div class="text-6xl font-bold text-primary mb-2 font-mono">
            {{ formatTime() }}
          </div>
          <div class="text-xl text-muted-foreground">
            {{ formatDate() }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div class="flex flex-col items-center space-y-1">
            <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div class="text-sm text-muted-foreground">Time Zone</div>
            <div class="text-lg font-semibold text-card-foreground">
              {{ timezone }}
            </div>
          </div>

          @if (utcOffset) {
          <div class="flex flex-col items-center space-y-1">
            <svg class="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div class="text-sm text-muted-foreground">UTC Offset</div>
            <div class="text-lg font-semibold text-card-foreground">
              {{ utcOffset }}
            </div>
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
  private baseTime: Date | null = null;
  private utcOffsetMinutes: number = 0;

  ngOnInit(): void {
    // Calculate UTC offset in minutes
    if (this.utcOffset) {
      const offsetParts = this.utcOffset.match(/([+-])(\d{2}):(\d{2})/);
      if (offsetParts) {
        const sign = offsetParts[1] === '+' ? 1 : -1;
        const hours = parseInt(offsetParts[2], 10);
        const minutes = parseInt(offsetParts[3], 10);
        this.utcOffsetMinutes = sign * (hours * 60 + minutes);
      }
    }

    // Get initial time
    this.updateTime();

    // Update every second
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateTime(): void {
    const now = new Date();
    
    if (this.utcOffsetMinutes !== 0) {
      // Calculate time in the target timezone
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const targetTime = new Date(utcTime + (this.utcOffsetMinutes * 60000));
      this.time.set(targetTime);
    } else {
      // Fallback to local time if no offset
      this.time.set(now);
    }
  }

  formatTime(): string {
    return this.time().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: this.timezone !== 'Local' ? this.timezone : undefined,
    });
  }

  formatDate(): string {
    return this.time().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: this.timezone !== 'Local' ? this.timezone : undefined,
    });
  }
}
