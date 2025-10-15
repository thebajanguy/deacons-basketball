import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class ProfileService {
    private ApiUrl: string;

    constructor(private http: HttpClient)
    {
        this.ApiUrl = environment.apiConfig.protectedResources.graphApi.uri;
    }

    public getProfile(): Observable<any> {
        return this.http.get(this.ApiUrl);
    }

    getUserProfile(): Observable<any> {
        return this.http.get(this.ApiUrl);
    }

    


}
