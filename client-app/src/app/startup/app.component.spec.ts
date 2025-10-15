import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Title, Meta } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';


describe('AppComponent', () =>{ 
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent],
            providers: [Title, Meta]
            }
        ).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should expose currentYear equal to the system year', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance as AppComponent;
        expect(app.currentYear).toBe(new Date().getFullYear());
    });
    
    it('should render the footer year', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const yearEl = compiled.querySelector('#year');
        expect(yearEl?.textContent).toContain(new Date().getFullYear().toString());
    });
});