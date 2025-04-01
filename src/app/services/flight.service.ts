import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from '../flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = 'http://localhost:8089/flight/api/flights'; // Update to your backend's URL


  constructor(private http: HttpClient) {}

  // Get all flights
  getAllFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }

  // Get flight by ID
  getFlightById(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.apiUrl}/${id}`);
  }

  // Add a new flight
  addFlight(flight: Flight): Observable<Flight> {
    console.log('Sending flight data:', flight); // Add this line
    return this.http.post<Flight>(this.apiUrl, flight);
  }

  // Delete a flight by ID
  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Update an existing flight
  updateFlight(flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${this.apiUrl}/${flight.idVol}`, flight);
  }
}
