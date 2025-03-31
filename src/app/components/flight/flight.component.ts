import { Component, OnInit } from '@angular/core';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent implements OnInit {
  flights: any[] = [];

  formVisible: boolean = false;
  newFlight = {
    numVol: '',
    compagnie: '',
    aeroportDepart: '',
    aeroportArrivee: '',
    dateVol: '',
    heureDepart: '',
    heureArrivee: '',
    etatVol: 'PROGRAMMED'  // Default value matches backend enum
  };

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  openForm(): void {
    this.formVisible = true;
  }

  closeForm(): void {
    this.formVisible = false;
  }

  loadFlights() {
    this.flightService.getAllFlights().subscribe(
      (data) => {
        this.flights = data;
      },
      (error) => {
        console.error('Error loading flights:', error);
      }
    );
  }

  onSubmit(): void {
    // Check if the dateVol is a valid date string in YYYY-MM-DD format
    const parsedDate = Date.parse(this.newFlight.dateVol);

    if (isNaN(parsedDate)) {
      console.error('Invalid date format:', this.newFlight.dateVol);
      return; // Prevent submission if the date is invalid
    }

    // Format the date to ensure it matches the backend's expected format (YYYY-MM-DD)
    const formattedDate = new Date(this.newFlight.dateVol).toLocaleDateString('en-CA');
    this.newFlight.dateVol = formattedDate;

    console.log('Form submitted with:', this.newFlight);

    this.flightService.addFlight(this.newFlight).subscribe(
      (response) => {
        console.log('Flight added successfully!', response);
        this.flights.push(response);  // Add the new flight to the list
        this.closeForm();  // Close the modal
      },
      (error) => {
        console.error('Error adding flight:', error);
      }
    );
  }
}
