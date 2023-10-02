package main

import (
	"encoding/json"
	"log"
	"net"
	"net/http"
	"strings"

	"github.com/rs/cors"
)

type Permissions struct {
	EditMode map[string]string `json:"editMode"`
	ViewMode map[string]string `json:"viewMode"`
}

// Global variable to store permission data
var storedPermissions = Permissions{
	EditMode: map[string]string{
		"buttonUpdate":                        "readwrite",
		"buttonCreate":                        "-",
		"buttonEdit":                          "-",
		"buttonDelete":                        "-",
		"textFieldTitle":                      "readwrite",
		"pickerStartDateTime":                 "readwrite",
		"selectorDuration":                    "readwrite",
		"selectorRepeat":                      "readwrite",
		"selectorAttendee":                    "readwrite",
		"textHost":                            "-",
		"editorAttachment":                    "readwrite",
		"textFieldDesc":                       "readwrite",
		"checkboxEveryoneCanModifyMeeting":    "readwrite",
		"checkboxEveryoneCanInviteOthers":     "readwrite",
		"checkboxSendInvitationToTheChatRoom": "readwrite",
		"toggleGoingOrNot":                    "-",
		"checkboxReceiveNotification":         "-",
	},
	ViewMode: map[string]string{
		"buttonUpdate":                        "-",
		"buttonCreate":                        "-",
		"buttonEdit":                          "readwrite",
		"buttonDelete":                        "readwrite",
		"textFieldTitle":                      "read",
		"pickerStartDateTime":                 "read",
		"selectorDuration":                    "-",
		"selectorRepeat":                      "read",
		"selectorAttendee":                    "read",
		"textHost":                            "read",
		"editorAttachment":                    "read",
		"textFieldDesc":                       "read",
		"checkboxEveryoneCanModifyMeeting":    "-",
		"checkboxEveryoneCanInviteOthers":     "-",
		"checkboxSendInvitationToTheChatRoom": "-",
		"toggleGoingOrNot":                    "readwrite",
		"checkboxReceiveNotification":         "readwrite",
	},
}

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
	http.HandleFunc("/v1/calendar/", handleCalendarEvent) // This will match any path starting with /v1/calendar/

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

func handleCalendarEvent(w http.ResponseWriter, r *http.Request) {
	if strings.Contains(r.URL.Path, "/events/") && r.Method == http.MethodGet {
		// Fake data for the Event
		fakeEvent := Event{
			EID:         "event id",
			Type:        "google",
			Topic:       "topic one",
			Start:       "1691651531",
			End:         "1691651631",
			Description: "test description",
			Host:        "+1234567",
			ChannelName: "G-xxxxxxxx",
			Attendees:   []Attendee{ /* ... Your fake attendees data here ... */ },
			IsGroup:     true,
			Group:       Group{GID: "xxxx", Name: "global dev group 1"},
			IsRecurring: true,
			RecurringRule: RecurringRule{
				Rrule: "FREQ=YEARLY;INTERVAL=1;BYMONTH=2;BYMONTHDAY=12",
			},
			Attachment: []Attachment{
				{
					Name: "Google",
					Link: "https://www.google.com/",
				},
			},
			EveryoneCanInviteOthers: true,
			EveryoneCanModify:       false,
			Permissions:             storedPermissions, // Add stored permissions to the event data
		}

		response := CalendarEventResponse{
			Status: 0,
			Data:   fakeEvent,
		}
		json.NewEncoder(w).Encode(response)
	} else {
		http.Error(w, "Method not allowed or invalid endpoint", http.StatusMethodNotAllowed)
	}
}

type Attendee struct {
	UID         string `json:"uid"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	Role        string `json:"role"`
	Going       string `json:"going"`
	IsGroupUser bool   `json:"isGroupUser"`
}

type Attachment struct {
	Name string `json:"name"`
	Link string `json:"link"`
}

type RecurringRule struct {
	Rrule string `json:"rrule"`
}

type Event struct {
	EID                     string        `json:"eid"`
	Type                    string        `json:"type"`
	Topic                   string        `json:"topic"`
	Start                   string        `json:"start"`
	End                     string        `json:"end"`
	Description             string        `json:"description"`
	Host                    string        `json:"host"`
	ChannelName             string        `json:"channelName"`
	Attendees               []Attendee    `json:"attendees"`
	IsGroup                 bool          `json:"isGroup"`
	Group                   Group         `json:"group"`
	IsRecurring             bool          `json:"isRecurring"`
	RecurringRule           RecurringRule `json:"recurringRule"`
	Attachment              []Attachment  `json:"attachment"`
	EveryoneCanInviteOthers bool          `json:"everyoneCanInviteOthers"`
	EveryoneCanModify       bool          `json:"everyoneCanModify"`
	Permissions             Permissions   `json:"permissions"`
}

type Group struct {
	GID  string `json:"gid"`
	Name string `json:"name"`
}

type CalendarEventResponse struct {
	Status int   `json:"status"`
	Data   Event `json:"data"`
}
