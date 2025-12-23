import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Story } from './story';

describe('Story', () => {
  let component: Story;
  let fixture: ComponentFixture<Story>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Story]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Story);
    component = fixture.componentInstance;

    component.data = {
      id: 0,
      title: 'Dummy',
      by: 'Tester',
      url: '',
      score: 0,
      time: 0,
      descendants: 0,
      kids: [],
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
