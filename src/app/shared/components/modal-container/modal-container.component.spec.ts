import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalContainerComponent} from './modal-container.component';
import {DEFAULT_DIALOG_CONFIG, DialogModule} from "@angular/cdk/dialog";

xdescribe('ModalContainerComponent', () => {
  let component: ModalContainerComponent;
  let fixture: ComponentFixture<ModalContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalContainerComponent,
        DialogModule,
      ],
      providers: [
        {
          provide: DEFAULT_DIALOG_CONFIG,
          useValue: {
            container: ModalContainerComponent
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
