import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';

describe('ThemeService', () => {
  let service: ThemeService;
  let document: Document;

  let mediaListeners: ((e: MediaQueryListEvent) => void)[] = [];

  beforeEach(() => {
    mediaListeners = [];

    spyOn(window, 'matchMedia').and.callFake((query: string) => {
      return {
        matches: false,
        media: query,
        addEventListener: (_: string, cb: any) => mediaListeners.push(cb),
        removeEventListener: () => {},
      } as any;
    });

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: document },
      ],
    });

    document = TestBed.inject(DOCUMENT);
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('should default to system preference when no stored theme', () => {
    expect(service.dark()).toBe(false);
  });

  it('should respect stored dark theme', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('dark');

    service = TestBed.inject(ThemeService);

    expect(service.dark()).toBe(true);
  });

  it('should respect stored light theme', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('light');

    service = TestBed.inject(ThemeService);

    expect(service.dark()).toBe(false);
  });

  it('should toggle .dark class on documentElement', () => {
    service.dark.set(true);
    expect(document.documentElement.classList.contains('dark')).toBeTrue();

    service.dark.set(false);
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
  });

  it('toggle() should flip theme and persist it', () => {
    const initial = service.dark();

    service.toggle();

    expect(service.dark()).toBe(!initial);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'theme',
      !initial ? 'dark' : 'light'
    );
  });

  it('clear() should remove stored theme and reset to system preference', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('dark');
    service = TestBed.inject(ThemeService);

    const fakeMedia = { matches: false } as MediaQueryList;
    spyOn(window, 'matchMedia').and.returnValue(fakeMedia as any);

    service.clear();

    expect(localStorage.removeItem).toHaveBeenCalledWith('theme');
    expect(service.dark()).toBe(false); // reset to system preference
  });

  it('should react to system theme changes when no stored preference', () => {
    mediaListeners.forEach(cb =>
      cb({ matches: true } as MediaQueryListEvent)
    );

    expect(service.dark()).toBe(true);
  });

  it('should ignore system changes when user preference exists', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('dark');

    service = TestBed.inject(ThemeService);

    mediaListeners.forEach(cb =>
      cb({ matches: false } as MediaQueryListEvent)
    );

    expect(service.dark()).toBe(true);
  });
});
