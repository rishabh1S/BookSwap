import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookComponent } from './list-book.component';

describe('ListBookComponent', () => {
  let component: ListBookComponent;
  let fixture: ComponentFixture<ListBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBookComponent]
    });
    fixture = TestBed.createComponent(ListBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
