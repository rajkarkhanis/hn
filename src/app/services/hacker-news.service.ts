import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { IStory } from '../types/Story';

@Injectable({
  providedIn: 'root',
})
export class HackerNewsService {
  private readonly BASE_URL = 'https://hacker-news.firebaseio.com/v0'; 

  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches the top story IDs from Hacker News
   */
  getTopStoriesIds(): Observable<number[]> {
    const url = `${this.BASE_URL}/topstories.json`;
    return this.http.get<number[]>(url);
  }

  /** Fetch details for the first `count` top stories */
  getTopStories(count: number = 30): Observable<IStory[]> {
    return this.getTopStoriesIds().pipe(
      map((ids) => ids.slice(0, count)),
      switchMap((ids) => {
        const requests = ids.map((id) => this.getStory(id));
        return forkJoin(requests);
      })
    );
  }

  /** Fetch details for a single story */
  getStory(id: number): Observable<IStory> {
    return this.http.get<IStory>(`${this.BASE_URL}/item/${id}.json`);
  }
}
