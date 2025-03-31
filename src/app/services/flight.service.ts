import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = 'http://localhost:8089/flight/api/flights'; // Update to your backend's URL

  constructor(private http: HttpClient) {}

  getAllFlights(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getFlightById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addFlight(flight: any) {
    return this.http.post('http://localhost:8089/flight/api/flights', flight, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  

  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
