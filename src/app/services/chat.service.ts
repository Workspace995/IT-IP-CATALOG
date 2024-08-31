import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Make sure the path is correct

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  callChatApi(requestBody: any): Observable<any> {
    const url = `${environment.chatUrl}/bot`; // Ensure the endpoint is correct
    return this.http.post(url, requestBody);
  }
}
