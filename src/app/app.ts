import { Component, OnInit, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Story } from './components/story/story';
import { HackerNewsService } from './services/hacker-news.service';
import { ThemeService } from './services/theme.service';
import { IStory } from './types/Story';
import { ZardDividerComponent } from './shared/components/divider/divider.component';
import { ZardLoaderComponent } from './shared/components/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [Story, ZardDividerComponent, ZardLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  loading = signal(false);
  topStories = signal<IStory[]>([]);

  constructor(
    private readonly hnService: HackerNewsService,
    private readonly themeService: ThemeService,
  ) {}

  ngOnInit() {
    this.loading.set(true);
    this.hnService.getTopStories().subscribe({
      next: (stories) => {
        this.topStories.set(stories);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching stories: ', err);
        this.loading.set(false);
      }
    });
  }
}
