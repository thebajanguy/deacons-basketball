import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ActiveUser, ActiveUserType } from "../models/active-user.type";
import { environment } from "../../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class IdentityService {

    userStorageKey: string = '';

    constructor()
    {
        this.userStorageKey = environment.appSettings.localUserStorageKey
    }

    set SetActiveUser(activeUser: ActiveUser) {
        this.RemoveStorageItems();

        localStorage.setItem(this.userStorageKey, JSON.stringify(activeUser));
        console.log('SetActiveUser:successful: ' + JSON.stringify(activeUser));
    }
    get GetActiveUser(): ActiveUser | null {
        const activeUserJson = localStorage.getItem(this.userStorageKey);
        if (activeUserJson) {
            console.log('GetActiveUser:successful: ' +JSON.parse(activeUserJson));
            return JSON.parse(activeUserJson);
        }
        return null;
    }

    RemoveStorageItems(): void {
        localStorage.removeItem(this.userStorageKey);
    }

    


}
