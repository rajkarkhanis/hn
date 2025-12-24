import { Injectable, Inject, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';

  readonly dark = signal(false);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (!isPlatformBrowser(platformId)) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const stored = localStorage.getItem(this.storageKey);

    if (stored === 'dark') {
      this.dark.set(true);
    } else if (stored === 'light') {
      this.dark.set(false);
    } else {
      this.dark.set(media.matches);
    }

    effect(() => {
      document.documentElement.classList.toggle('dark', this.dark());
    });

    media.addEventListener('change', e => {
      if (!localStorage.getItem(this.storageKey)) {
        this.dark.set(e.matches);
      }
    });
  }

  toggle() {
    const next = !this.dark();
    this.dark.set(next);
    localStorage.setItem(this.storageKey, next ? 'dark' : 'light');
  }

  clear() {
    localStorage.removeItem(this.storageKey);
    this.dark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
}
