import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { grupoFindByResolver } from './grupo-find-by.resolver';

describe('grupoFindByResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => grupoFindByResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
