import {
  Component, Input, Output, EventEmitter, ElementRef, HostListener, signal,
  effect, AfterViewInit, OnDestroy, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vsa-timer-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-modal.component.html',
  styleUrls: ['./timer-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerModalComponent implements AfterViewInit, OnDestroy {
  /** milliseconds before showing (default 10s) */
  @Input() delay = 10000;
  /** localStorage flag key (set when “Don’t show again”) */
  @Input() storageKey = 'vsa.timer.dismissed';
  /** days to remember dismissal */
  @Input() rememberDays = -1;
  /** modal title */
  @Input() title = 'Welcome to VSA Prep';
  /** optional deep link for primary action */
  @Input() primaryHref: string | null = '/en/academics-and-sports/register#register';
  @Input() hasProjectedContent: boolean = true;


  /** fires when user closes */
  @Output() closed = new EventEmitter<'x'|'overlay'|'dismiss'|'dont-show'|'primary'>();

  open = signal(false);
  headingId = `wm-${Math.random().toString(36).slice(2)}`;

  private timer?: number;
  private previouslyFocused?: HTMLElement | null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    // detect if content was projected
    this.hasProjectedContent = this.el.nativeElement.querySelector('ng-content') === null;

    // respect "don't show again"
    if (this.isDismissed()) return;

    // open after delay
    this.timer = window.setTimeout(() => this.show(), this.delay);

    // lock body scroll when open/close
    effect(() => {
      const isOpen = this.open();
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  ngOnDestroy(): void {
    if (this.timer) window.clearTimeout(this.timer);
    document.body.style.overflow = '';
  }

  show(): void {
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    this.open.set(true);
    // focus first interactive control after paint
    setTimeout(() => {
      const first = this.el.nativeElement.querySelector<HTMLElement>('.wm-primary, .wm-close, button, a');
      first?.focus();
    });
  }

  close(reason: 'x'|'overlay'|'dismiss'|'dont-show'|'primary' = 'dismiss'): void {
    this.open.set(false);
    this.closed.emit(reason);
    this.previouslyFocused?.focus?.();
  }

  primaryAction(): void {
    this.closed.emit('primary');
    if (this.primaryHref) window.location.assign(this.primaryHref);
    this.close('primary');
  }

  dontShowAgain(): void {
    const until = Date.now() + this.rememberDays * 86400000;
    localStorage.setItem(this.storageKey, String(until));
    this.close('dont-show');
  }

  private isDismissed(): boolean {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return false;
    const until = Number(raw);
    return Number.isFinite(until) && Date.now() < until;
  }

  /** ESC to close */
  @HostListener('document:keydown.escape')
  onEsc() { if (this.open()) this.close('dismiss'); }
}
