import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { formIdResolver } from './form-id.resolver';

describe('formIdResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => formIdResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
