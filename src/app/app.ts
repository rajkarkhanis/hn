import { Component, OnInit } from '@angular/core';
import { Story } from './components/story/story';
import { HackerNewsService } from './services/hacker-news.service';
import { IStory } from './types/Story';
import { ZardDividerComponent } from './shared/components/divider/divider.component';

@Component({
  selector: 'app-root',
  imports: [Story, ZardDividerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  topStories: IStory[] = [];

  constructor(private readonly hnService: HackerNewsService) {}

  ngOnInit() {
    this.hnService.getTopStories().subscribe({
      next: (stories) => this.topStories = stories,
      error: (err) => console.error('Error fetching stories: ', err)
    });
  }
}
