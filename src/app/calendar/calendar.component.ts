import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FlightService } from '../services/flight.service';
import { Flight } from '../flight.model';

@Component({
  selector: 'app-flight-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  flights: Flight[] = []; // Store original flights
  calendarEvents: EventInput[] = []; // Store formatted events for the calendar

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    events: [],
    eventDrop: this.handleEventDrop.bind(this),
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
  };

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.fetchFlights();
  }

  fetchFlights() {
    this.flightService.getAllFlights().subscribe(
      (data: Flight[]) => {
        this.flights = data;
        this.calendarEvents = this.flights.map((flight) => ({
          id: flight.idVol.toString(), // Use idVol to match backend model
          title: `${flight.numVol} - ${flight.compagnie}`,
          start: `${flight.dateVol}T${flight.heureDepart}`,
          end: `${flight.dateVol}T${flight.heureArrivee}`,
          backgroundColor: this.getStatusColor(flight.etatVol), // Use etatVol for status
          extendedProps: {
            origin: flight.aeroportDepart,
            destination: flight.aeroportArrivee,
            status: flight.etatVol, // Make sure 'etatVol' is in your Flight model
          },
        }));

        // ✅ Assign calendarEvents to FullCalendar
        this.calendarOptions.events = [...this.calendarEvents];
      },
      (error) => console.error('Error fetching flights:', error)
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ON_TIME': return 'green';
      case 'DELAYED': return 'orange';
      case 'CANCELED': return 'red';
      default: return 'blue';
    }
  }

  handleEventDrop(event: any) {
    const flight = this.flights.find((f) => f.idVol.toString() === event.event.id);
    if (flight) {
      flight.dateVol = event.event.startStr.split('T')[0]; // Extract only date
      flight.heureDepart = event.event.startStr.split('T')[1]; // Extract time

      this.flightService.updateFlight(flight).subscribe(
        () => console.log('Flight updated:', flight),
        (error) => console.error('Error updating flight:', error)
      );
    }
  }

  handleEventClick(event: any) {
    alert(
      `Flight: ${event.event.title}
      Origin: ${event.event.extendedProps.origin}
      Destination: ${event.event.extendedProps.destination}
      Status: ${event.event.extendedProps.status}`
    );
  }

  handleDateClick(event: any) {
    const numVol = prompt('Enter Flight Number');
    const compagnie = prompt('Enter Airline');
    if (numVol && compagnie) {
      const newFlight: Flight = {
        idVol: Math.floor(Math.random() * 1000), // Simulating a unique ID
        numVol,
        compagnie,
        dateVol: event.dateStr,
        heureDepart: '08:00:00', // Default departure time
        heureArrivee: '10:00:00', // Default arrival time
        aeroportDepart: 'Unknown', // Assuming you would update this based on your UI
        aeroportArrivee: 'Unknown', // Same as above
        etatVol: 'ON_TIME', // Assuming you have these statuses in your model
      };

      this.flightService.addFlight(newFlight).subscribe(
        (addFlight: Flight) => {
          this.flights.push(addFlight);
          this.calendarEvents.push({
            id: addFlight.idVol.toString(),
            title: `${addFlight.numVol} - ${addFlight.compagnie}`,
            start: `${addFlight.dateVol}T${addFlight.heureDepart}`,
            end: `${addFlight.dateVol}T${addFlight.heureArrivee}`,
            backgroundColor: this.getStatusColor(addFlight.etatVol),
            extendedProps: {
              origin: addFlight.aeroportDepart,
              destination: addFlight.aeroportArrivee,
              status: addFlight.etatVol,
            },
          });

          // Update FullCalendar events
          this.calendarOptions.events = [...this.calendarEvents];
        },
        (error: any) => console.error('Error creating flight:', error)
      );
    }
  }
}
