import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HackerNewsService } from './hacker-news.service';
import { IStory } from '../types/Story';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackerNewsService],
    });

    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch top story IDs', () => {
    const mockIds = [1, 2, 3];

    service.getTopStoriesIds().subscribe((ids) => {
      expect(ids).toEqual(mockIds);
    });

    const req = httpMock.expectOne('https://hacker-news.firebaseio.com/v0/topstories.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockIds);
  });

  it('should fetch a single story', () => {
    const mockStory: IStory = {
      id: 1,
      title: 'Test Story',
      by: 'author',
      url: 'https://example.com',
      score: 100,
      time: 123456,
      descendants: 5,
      kids: [11, 12],
    };

    service.getStory(1).subscribe((story) => {
      expect(story).toEqual(mockStory);
    });

    const req = httpMock.expectOne('https://hacker-news.firebaseio.com/v0/item/1.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockStory);
  });

  it('should fetch top stories details', () => {
    const mockIds = [1, 2];
    const mockStories: IStory[] = [
      { id: 1, title: 'Story 1', by: 'author1', score: 10, time: 123, descendants: 1, kids: [] },
      { id: 2, title: 'Story 2', by: 'author2', score: 20, time: 456, descendants: 2, kids: [] },
    ];

    service.getTopStories(2).subscribe((stories) => {
      expect(stories).toEqual(mockStories);
    });

    // first request: top story IDs
    const reqIds = httpMock.expectOne('https://hacker-news.firebaseio.com/v0/topstories.json');
    reqIds.flush(mockIds);

    // next requests: individual stories
    const req1 = httpMock.expectOne('https://hacker-news.firebaseio.com/v0/item/1.json');
    req1.flush(mockStories[0]);

    const req2 = httpMock.expectOne('https://hacker-news.firebaseio.com/v0/item/2.json');
    req2.flush(mockStories[1]);
  });
});
