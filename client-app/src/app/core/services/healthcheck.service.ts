import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {

    private apiUrl = ''; 

    constructor(private http: HttpClient, private us: UtilitiesService) { 
    }

    // Example GET request
    performHealthCheck(){ //: Observable<any> {
        const apiUrl = `${this.us.ApiBaseUrl}/api/HealthCheck`;

        return this.http.get<string>(apiUrl)
            .pipe(map(data => {
                console.log(`PerformHealthCheck http action: ${data}`);
                return data;
            }));
    }
}
