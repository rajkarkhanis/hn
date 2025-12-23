import { Component, OnInit, Input } from '@angular/core';
import { HackerNewsService } from '../../services/hacker-news.service';
import { IStory } from '../../types/Story';

@Component({
  selector: 'app-story',
  imports: [],
  templateUrl: './story.html',
  styleUrl: './story.css',
})
export class Story {
  @Input() data!: IStory;
}
