import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorymenuComponent } from './categorymenu.component';

describe('CategorymenuComponent', () => {
  let component: CategorymenuComponent;
  let fixture: ComponentFixture<CategorymenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorymenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorymenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
