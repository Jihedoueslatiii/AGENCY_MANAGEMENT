import { Component, OnInit } from '@angular/core';
import { Flight } from 'src/app/flight.model';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent implements OnInit {
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  formVisible = false;
  searchTerm = '';
  
  // Stats for dashboard cards
  stats = {
    total: '',
    scheduled: '',
    inFlight: 0,
    delayed: 0
  };
  newFlight: Flight = {
    idVol: 0,
    numVol: '',
    compagnie: '',
    aeroportDepart: '',
    aeroportArrivee: '',
    dateVol: this.getCurrentDate(),
    heureDepart: '',
    heureArrivee: '',
    etatVol: 'PROGRAMMED'
  };

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  private getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  openForm(): void {
    this.formVisible = true;
  }

  closeForm(): void {
    this.formVisible = false;
    this.resetForm();
  }

  loadFlights(): void {
    this.flightService.getAllFlights().subscribe(
      (data: Flight[]) => {
        this.flights = data;
        this.filteredFlights = [...data]; // Initialize filtered flights
      },
      (error) => {
        console.error('Error loading flights:', error);
        alert('Failed to load flights. Please try again.');
      }
    );
  }

  onSubmit(): void {
    // Ensure time formats are correct before sending to service
    // Make sure times include seconds to match Java LocalTime format
    this.newFlight.heureDepart = this.ensureTimeFormat(this.newFlight.heureDepart);
    this.newFlight.heureArrivee = this.ensureTimeFormat(this.newFlight.heureArrivee);

    // Validate form data
    if (!this.validateFlightForm()) {
      return;
    }

    this.flightService.addFlight(this.newFlight).subscribe(
      (response: Flight) => {
        this.flights.push(response);
        this.closeForm();
        // Reload flights to ensure we have the latest data
        this.loadFlights();
      },
      (error) => {
        console.error('Error adding flight:', error);
        alert(`Failed to add flight: ${error.error?.message || 'Please check all fields'}`);
      }
    );
  }

  private validateFlightForm(): boolean {
    // Check if required fields are filled
    if (!this.newFlight.numVol || !this.newFlight.compagnie || 
        !this.newFlight.aeroportDepart || !this.newFlight.aeroportArrivee || 
        !this.newFlight.dateVol || !this.newFlight.heureDepart || 
        !this.newFlight.heureArrivee || !this.newFlight.etatVol) {
      alert('Please fill in all required fields');
      return false;
    }

    // Check if arrival time is after departure time
    const departTime = this.newFlight.heureDepart;
    const arriveTime = this.newFlight.heureArrivee;
    
    if (departTime >= arriveTime) {
      alert('Arrival time must be after departure time');
      return false;
    }

    return true;
  }

  private ensureTimeFormat(time: string): string {
    if (!time) return '';
    
    // If time already has seconds, return as is
    if (time.split(':').length === 3) return time;
    
    // If time is in HH:MM format, add seconds
    if (time.split(':').length === 2) return `${time}:00`;
    
    // Return original if format is unexpected
    return time;
  }

  resetForm(): void {
    this.newFlight = {
      idVol: 0,
      numVol: '',
      compagnie: '',
      aeroportDepart: '',
      aeroportArrivee: '',
      dateVol: this.getCurrentDate(),
      heureDepart: '',
      heureArrivee: '',
      etatVol: 'PROGRAMMED'
    };
  }
  filterFlights(): void {
    if (!this.searchTerm) {
      this.filteredFlights = [...this.flights];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredFlights = this.flights.filter(flight => 
      flight.numVol.toLowerCase().includes(term) ||
      flight.compagnie.toLowerCase().includes(term) ||
      flight.aeroportDepart.toLowerCase().includes(term) ||
      flight.aeroportArrivee.toLowerCase().includes(term)
    );
  }
}