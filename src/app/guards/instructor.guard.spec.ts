import { TestBed, async, inject } from '@angular/core/testing';

import { InstructorGuard } from './instructor.guard';

describe('InstructorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstructorGuard]
    });
  });

  it('should ...', inject([InstructorGuard], (guard: InstructorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
