export interface Flight {
    idVol: number;          // ID of the flight (corresponds to Long in Java)
    numVol: string;         // Flight number (e.g., "AF1234")
    compagnie: string;      // Airline (e.g., "Air France")
    aeroportDepart: string; // Departure airport (e.g., "Paris Charles de Gaulle")
    aeroportArrivee: string; // Arrival airport (e.g., "New York JFK")
    dateVol: string;        // Flight date in YYYY-MM-DD format (LocalDate in Java)
    heureDepart: string;    // Departure time in HH:mm:ss format (LocalTime in Java)
    heureArrivee: string;   // Arrival time in HH:mm:ss format (LocalTime in Java)
    etatVol: string;        // Flight status (e.g., "ON_TIME", "DELAYED", "CANCELLED")
  }
  