import SwiftUI

class PermissionsViewModel: ObservableObject {
    @Published var permissions: [String: String] = [:]
    
    func permission(for key: String) -> String {
        return permissions[key] ?? "-"
    }
    
    func fetchPermissionsAsync() async {
        // Request permissions from the server
        guard let url = URL(string: "http://192.168.0.26:8080/permissions") else { return }
        
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            if let decodedPermissions = try? JSONDecoder().decode([String: [String: String]].self, from: data) {
                DispatchQueue.main.async {
                    self.permissions = decodedPermissions["editMode"] ?? [:]
                }
            }
        } catch {
            print("Failed to fetch permissions:", error)
        }
    }
}

struct MeetingEditorView: View {
    @StateObject var viewModel = PermissionsViewModel()  // Use StateObject for owned ViewModel
    
    let verticalPadding: CGFloat = 2
    
    @State private var title: String = ""
    @State private var startTime = Date()
    @State private var durationSelection: Int = 0
    @State private var repeatSelection: Int = 0
    @State private var selectedPerson: String = ""
    @State private var fileName: String = ""
    @State private var fileLink: String = ""
    @State private var descriptionText: String = ""
    @State private var canInviteOthers: Bool = false
    @State private var canModifyMeeting: Bool = false
    @State private var sendInvitation: Bool = false
    @State private var isGoing: Bool = false
    @State private var isReceiveNotificationOn: Bool = false
    
    private let durationOptions = ["15 mins", "30 mins", "1 hr", "2 hrs", "4 hrs", "8 hrs", "10 hrs", "12 hrs", "24 hrs", "48 hrs"]
    private let repeatOptions = ["Never", "Daily", "Weekly", "Monthly"]
    private let persons = ["John Doe", "Jane Smith", "Alice", "Bob"]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading) {
                // 1. Toolbar
                HStack {
                    
                    Spacer()
                    if viewModel.permission(for: "buttonCreate") != "-" {
                        Button(action: {}) {
                            HStack {
                                Text("Create")
                                Image(systemName: "plus.circle.fill")
                            }
                        }
                        .disabled(viewModel.permission(for: "buttonCreate") == "read")
                        Text("|").padding(.horizontal, 10) // Using | as a divider with added horizontal padding
                    }
                    
                    
                    if viewModel.permission(for: "buttonEdit") != "-" {
                        Button(action: {}) {
                            HStack {
                                Text("Edit")
                                Image(systemName: "pencil.circle.fill")
                            }
                        }
                        .disabled(viewModel.permission(for: "buttonEdit") == "read")
                        Text("|").padding(.horizontal, 10) // Using | as a divider with added horizontal padding
                    }
                    
                    
                    
                    
                    if viewModel.permission(for: "buttonDelete") != "-" {
                        Button(action: {}) {
                            HStack {
                                Text("Delete")
                                Image(systemName: "trash.circle.fill")
                            }
                        }
                        .disabled(viewModel.permission(for: "buttonDelete") == "read")
                    }
                    
                }
                .padding(.vertical, verticalPadding)
                
                // 2. Title input
                if viewModel.permission(for: "textFieldTitle") != "-" {
                    HStack {
                        Text("Title:")
                        TextField("Enter title", text: $title)
                            .disabled(viewModel.permission(for: "textFieldTitle") == "read")
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(8)
                }
                
                // 3. Time Picker
                if viewModel.permission(for: "pickerStartDateTime") != "-" {
                    HStack {
                        Text("Start Time:")
                        DatePicker("", selection: $startTime, displayedComponents: [.date, .hourAndMinute])
                            .labelsHidden()
                            .disabled(viewModel.permission(for: "pickerStartDateTime") == "read")
                    }
                    .padding(.vertical, verticalPadding)
                }
                
                // 4. Duration Picker
                if viewModel.permission(for: "selectorDuration") != "-" {
                    HStack {
                        Text("Duration:")
                        Picker("Duration", selection: $durationSelection) {
                            ForEach(durationOptions.indices, id: \.self) { index in
                                Text(durationOptions[index])
                            }
                        }
                        .disabled(viewModel.permission(for: "selectorDuration") == "read")
                    }
                    .padding(.vertical, verticalPadding)
                }
                
                // 5. Repeat Picker
                if viewModel.permission(for: "selectorRepeat") != "-" {
                    HStack {
                        Text("Repeats:")
                        Picker("Repeat", selection: $repeatSelection) {
                            ForEach(repeatOptions.indices, id: \.self) { index in
                                Text(repeatOptions[index])
                            }
                        }
                        .disabled(viewModel.permission(for: "selectorRepeat") == "read")
                    }
                    .padding(.vertical, verticalPadding)
                }
                
                // 6. Attendees Picker
                if viewModel.permission(for: "selectorAttendee") != "-" {
                    HStack {
                        Text("Participants:")
                        Picker("Participants", selection: $selectedPerson) {
                            ForEach(persons, id: \.self) { person in
                                Text(person)
                            }
                        }
                        .pickerStyle(MenuPickerStyle())
                        .disabled(viewModel.permission(for: "selectorAttendee") == "read")
                    }
                    .padding(.vertical, verticalPadding)
                }
                
                // 7. File Attachment
                if viewModel.permission(for: "editorAttachment") != "-" {
                    VStack(alignment: .leading) {
                        Text("File Attachment:")
                        TextField("File Name", text: $fileName)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .disabled(viewModel.permission(for: "editorAttachment") == "read")
                        TextField("Link", text: $fileLink)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .disabled(viewModel.permission(for: "editorAttachment") == "read")
                    }
                    .padding(.vertical, verticalPadding)
                }
                
                // 8. Description
                if viewModel.permission(for: "textFieldDesc") != "-" {
                    VStack(alignment: .leading) {
                        Text("Description:")
                        TextEditor(text: $descriptionText)
                            .frame(height: 100)
                            .border(Color.gray, width: 1)
                            .disabled(viewModel.permission(for: "textFieldDesc") == "read")
                    }
                    .padding(.vertical, verticalPadding)
                }
                
                // 9. Permission Checkboxes
                VStack(alignment: .leading) {
                    if viewModel.permission(for: "checkboxEveryoneCanInviteOthers") != "-" {
                        Toggle(isOn: $canInviteOthers) {
                            Text("Everyone can invite others")
                        }
                        .disabled(viewModel.permission(for: "checkboxEveryoneCanInviteOthers") == "read")
                    }
                    
                    if viewModel.permission(for: "checkboxEveryoneCanModifyMeeting") != "-" {
                        Toggle(isOn: $canModifyMeeting) {
                            Text("Everyone can modify meeting")
                        }
                        .disabled(viewModel.permission(for: "checkboxEveryoneCanModifyMeeting") == "read")
                    }
                    
                    if viewModel.permission(for: "checkboxSendInvitationToTheChatRoom") != "-" {
                        Toggle(isOn: $sendInvitation) {
                            Text("Send invitation to the chat room")
                        }
                        .disabled(viewModel.permission(for: "checkboxSendInvitationToTheChatRoom") == "read")
                    }
                }
                .padding(.vertical, verticalPadding)
                
                // 10. Going?
                if viewModel.permission(for: "toggleGoingOrNot") != "-" {
                    HStack {
                        Text("Going?")
                        Button(action: {}) {
                            Text("YES")
                        }
                        .disabled(viewModel.permission(for: "toggleGoingOrNot") == "read")
                        Button(action: {}) {
                            Text("NO")
                        }
                        .disabled(viewModel.permission(for: "toggleGoingOrNot") == "read")
                    }
                    .padding(.vertical, verticalPadding)
                }
                
                // 11. Receive Notification
                if viewModel.permission(for: "checkboxReceiveNotification") != "-" {
                    Toggle(isOn: $isReceiveNotificationOn) {
                        Text("Receive Notification")
                    }
                    .disabled(viewModel.permission(for: "checkboxReceiveNotification") == "read")
                    .padding(.vertical, verticalPadding)
                }
                
            }
            .padding()
        }
        .refreshable {
            await viewModel.fetchPermissionsAsync()
        }
        .onAppear {
            Task {
                await viewModel.fetchPermissionsAsync()
            }
        }
    }
}

struct MeetingEditorView_Previews: PreviewProvider {
    static var previews: some View {
        MeetingEditorView()
    }
}
