package main

import (
	"encoding/json"
	"log"
	"net"
	"net/http"

	"github.com/rs/cors"
)

type Permissions struct {
	EditMode map[string]string `json:"editMode"`
	ViewMode map[string]string `json:"viewMode"`
}

// Global variable to store permission data
var storedPermissions Permissions

func handlePermissions(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var p Permissions
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		// Store the permission data
		storedPermissions = p
		// Print the POST request data
		log.Printf("Received POST data: %+v\n", p)
		w.WriteHeader(http.StatusOK)
	} else if r.Method == http.MethodGet {
		// Return the stored permission data
		json.NewEncoder(w).Encode(storedPermissions)
		// Print the GET response data
		log.Printf("Responded to GET with data: %+v\n", storedPermissions)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/permissions", handlePermissions)

	// Use CORS middleware
	handler := cors.Default().Handler(http.DefaultServeMux)

	// Get the server's IP address
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		log.Fatalf("Failed to get server IP: %v", err)
	}
	var ip string
	for _, addr := range addrs {
		if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				ip = ipnet.IP.String()
				break
			}
		}
	}
	log.Printf("Server started at http://%s:8080", ip)

	log.Fatal(http.ListenAndServe(":8080", handler))
}
