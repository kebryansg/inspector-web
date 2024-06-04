import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { companyByIdResolver } from './company-by-id.resolver';

describe('empresaByIdResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => companyByIdResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
