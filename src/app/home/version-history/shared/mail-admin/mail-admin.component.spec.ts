import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailAdminComponent } from './mail-admin.component';

describe('MailAdminComponent', () => {
  let component: MailAdminComponent;
  let fixture: ComponentFixture<MailAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
