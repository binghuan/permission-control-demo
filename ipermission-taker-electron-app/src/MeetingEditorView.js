import React, { useState, useEffect } from 'react';
import { Button, TextField, Checkbox, FormControlLabel, MenuItem, Select, Typography, Container, Grid, Alert } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import usePermissionsViewModel from './PermissionsViewModel';

const MeetingEditorView = () => {
  const { permissions, error } = usePermissionsViewModel();
  
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [durationSelection, setDurationSelection] = useState(0);
  const [repeatSelection, setRepeatSelection] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileLink, setFileLink] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [canInviteOthers, setCanInviteOthers] = useState(false);
  const [canModifyMeeting, setCanModifyMeeting] = useState(false);
  const [sendInvitation, setSendInvitation] = useState(false);
  const [isGoing, setIsGoing] = useState(false);
  const [isReceiveNotificationOn, setIsReceiveNotificationOn] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const durationOptions = ["15 mins", "30 mins", "1 hr", "2 hrs", "4 hrs", "8 hrs", "10 hrs", "12 hrs", "24 hrs", "48 hrs"];
  const repeatOptions = ["Never", "Daily", "Weekly", "Monthly"];
  const persons = ["John Doe", "Jane Smith", "Alice", "Bob"];

  useEffect(() => {
    if (error) {
      setShowErrorAlert(true);
    }
  }, [error]);

  return (
    <Container>
      {showErrorAlert && <Alert severity="error">Failed to fetch permissions, using default permissions.</Alert>}
      <Grid container spacing={2} direction="column">
        {/* Toolbar */}
        <Grid item>
          <Grid container justifyContent="flex-end" spacing={1}>
            {permissions.buttonCreate !== "-" && (
              <Grid item>
                <Button
                  variant="contained"
                  disabled={permissions.buttonCreate === "read"}
                >
                  Create
                </Button>
              </Grid>
            )}
            {permissions.buttonEdit !== "-" && (
              <Grid item>
                <Button
                  variant="contained"
                  disabled={permissions.buttonEdit === "read"}
                >
                  Edit
                </Button>
              </Grid>
            )}
            {permissions.buttonDelete !== "-" && (
              <Grid item>
                <Button
                  variant="contained"
                  disabled={permissions.buttonDelete === "read"}
                >
                  Delete
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
        
        {/* Title input */}
        {permissions.textFieldTitle !== "-" && (
          <Grid item>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={permissions.textFieldTitle === "read"}
            />
          </Grid>
        )}
        
        {/* Time Picker */}
        {permissions.pickerStartDateTime !== "-" && (
          <Grid item>
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              dateFormat="Pp"
              disabled={permissions.pickerStartDateTime === "read"}
              customInput={<TextField fullWidth label="Start Time" />}
            />
          </Grid>
        )}
        
        {/* Duration Picker */}
        {permissions.selectorDuration !== "-" && (
          <Grid item>
            <Select
              label="Duration"
              fullWidth
              value={durationSelection}
              onChange={(e) => setDurationSelection(e.target.value)}
              disabled={permissions.selectorDuration === "read"}
            >
              {durationOptions.map((option, index) => (
                <MenuItem key={index} value={index}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        )}
        
        {/* Repeat Picker */}
        {permissions.selectorRepeat !== "-" && (
          <Grid item>
            <Select
              label="Repeats"
              fullWidth
              value={repeatSelection}
              onChange={(e) => setRepeatSelection(e.target.value)}
              disabled={permissions.selectorRepeat === "read"}
            >
              {repeatOptions.map((option, index) => (
                <MenuItem key={index} value={index}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        )}
        
        {/* Attendees Picker */}
        {permissions.selectorAttendee !== "-" && (
          <Grid item>
            <Select
              label="Participants"
              fullWidth
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              disabled={permissions.selectorAttendee === "read"}
            >
              {persons.map((person) => (
                <MenuItem key={person} value={person}>
                  {person}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        )}
        
        {/* File Attachment */}
        {permissions.editorAttachment !== "-" && (
          <Grid item>
            <TextField
              label="File Name"
              fullWidth
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              disabled={permissions.editorAttachment === "read"}
            />
            <TextField
              label="Link"
              fullWidth
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
              disabled={permissions.editorAttachment === "read"}
            />
          </Grid>
        )}
        
        {/* Description */}
        {permissions.textFieldDesc !== "-" && (
          <Grid item>
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={4}
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              disabled={permissions.textFieldDesc === "read"}
            />
          </Grid>
        )}
        
        {/* Permission Checkboxes */}
        {permissions.checkboxEveryoneCanInviteOthers !== "-" && (
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={canInviteOthers}
                  onChange={(e) => setCanInviteOthers(e.target.checked)}
                  disabled={permissions.checkboxEveryoneCanInviteOthers === "read"}
                />
              }
              label="Everyone can invite others"
            />
          </Grid>
        )}
        {permissions.checkboxEveryoneCanModifyMeeting !== "-" && (
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={canModifyMeeting}
                  onChange={(e) => setCanModifyMeeting(e.target.checked)}
                  disabled={permissions.checkboxEveryoneCanModifyMeeting === "read"}
                />
              }
              label="Everyone can modify meeting"
            />
          </Grid>
        )}
        {permissions.checkboxSendInvitationToTheChatRoom !== "-" && (
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sendInvitation}
                  onChange={(e) => setSendInvitation(e.target.checked)}
                  disabled={permissions.checkboxSendInvitationToTheChatRoom === "read"}
                />
              }
              label="Send invitation to the chat room"
            />
          </Grid>
        )}
        
        {/* Going? */}
        {permissions.toggleGoingOrNot !== "-" && (
          <Grid item>
            <Typography>Going?</Typography>
            <Button variant="contained" disabled={permissions.toggleGoingOrNot === "read"}>
              YES
            </Button>
            <Button variant="contained" disabled={permissions.toggleGoingOrNot === "read"}>
              NO
            </Button>
          </Grid>
        )}
        
        {/* Receive Notification */}
        {permissions.checkboxReceiveNotification !== "-" && (
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isReceiveNotificationOn}
                  onChange={(e) => setIsReceiveNotificationOn(e.target.checked)}
                  disabled={permissions.checkboxReceiveNotification === "read"}
                />
              }
              label="Receive Notification"
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default MeetingEditorView;
