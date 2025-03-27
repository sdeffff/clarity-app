import { TestBed } from '@angular/core/testing';

import { HttpHeaderBuilderService } from './http-header-builder.service';

describe('HttpHeaderBuilderService', () => {
  let service: HttpHeaderBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpHeaderBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
