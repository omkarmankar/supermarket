import { TestBed } from '@angular/core/testing';

import { SupercategorymenuService } from './supercategorymenu.service';

describe('SupercategorymenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupercategorymenuService = TestBed.get(SupercategorymenuService);
    expect(service).toBeTruthy();
  });
});
