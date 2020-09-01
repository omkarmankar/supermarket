import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyaddressesComponent } from './myaddresses.component';

describe('MyaddressesComponent', () => {
  let component: MyaddressesComponent;
  let fixture: ComponentFixture<MyaddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyaddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
