import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferscarouselComponent } from './offerscarousel.component';

describe('OfferscarouselComponent', () => {
  let component: OfferscarouselComponent;
  let fixture: ComponentFixture<OfferscarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferscarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferscarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
