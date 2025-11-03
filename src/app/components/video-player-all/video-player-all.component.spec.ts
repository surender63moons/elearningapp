import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerAllComponent } from './video-player-all.component';

describe('VideoPlayerAllComponent', () => {
  let component: VideoPlayerAllComponent;
  let fixture: ComponentFixture<VideoPlayerAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoPlayerAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
