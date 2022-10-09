import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMetadataComponent } from './app-metadata.component';

describe('AppMetadataComponent', () => {
  let component: AppMetadataComponent;
  let fixture: ComponentFixture<AppMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMetadataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
