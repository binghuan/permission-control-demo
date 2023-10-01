import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Switch, Button } from '@mui/material';
import axios from 'axios'; // Importing axios for HTTP requests
import './App.css';

const initialPermissions = {
  editMode: {
    "buttonCreate": "readwrite",
    "buttonEdit": "readwrite",
    "buttonDelete": "readwrite",
    "textFieldTitle": "readwrite",
    "pickerStartDateTime": "readwrite",
    "selectorDuration": "readwrite",
    "selectorRepeat": "readwrite",
    "selectorAttendee": "readwrite",
    "editorAttachment": "readwrite",
    "textFieldDesc": "readwrite",
    "checkboxEveryoneCanModifyMeeting": "readwrite",
    "checkboxEveryoneCanInviteOthers": "readwrite",
    "checkboxSendInvitationToTheChatRoom": "readwrite",
    "toggleGoingOrNot": "readwrite",
    "checkboxReceiveNotification": "readwrite"
  },
  viewMode: {
    "buttonCreate": "-",
    "buttonEdit": "readwrite",
    "buttonDelete": "readwrite",
    "textFieldTitle": "read",
    "pickerStartDateTime": "read",
    "selectorDuration": "read",
    "selectorRepeat": "read",
    "selectorAttendee": "read",
    "editorAttachment": "read",
    "textFieldDesc": "read",
    "checkboxEveryoneCanModifyMeeting": "read",
    "checkboxEveryoneCanInviteOthers": "read",
    "checkboxSendInvitationToTheChatRoom": "read",
    "toggleGoingOrNot": "read",
    "checkboxReceiveNotification": "readwrite"
  }
};

function App() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);

  // Use useEffect to listen for changes in permissions
  useEffect(() => {
    // Function to send data to the server
    const sendDataToServer = async () => {
      try {
        await axios.post('http://localhost:8080/permissions', permissions);
        console.log('Data sent to server successfully');
      } catch (error) {
        console.error('Failed to send data to server:', error);
      }
    };

    sendDataToServer();
  }, [permissions]);

  const handleToggleChange = (key, mode, type) => {
    setPermissions(prevPermissions => {
      const currentPermission = prevPermissions[mode][key];

      let newPermission;
      if (type === 'write' && currentPermission !== 'readwrite') {
        newPermission = 'readwrite'; // If write is turned on, read is also turned on.
      } else if (type === 'write' && currentPermission === 'readwrite') {
        newPermission = 'read'; // If write is turned off while in readwrite mode, it becomes 'read'.
      } else if (type === 'read' && currentPermission === 'readwrite') {
        newPermission = '-'; // If read is turned off while in readwrite mode, both are turned off.
      } else if (type === 'read' && currentPermission === 'read') {
        newPermission = '-'; // If read is turned off, the permission becomes '-'.
      } else if (type === 'read' && currentPermission === '-') {
        newPermission = 'read'; // If read is turned on while in '-' mode, it becomes 'read'.
      } else {
        newPermission = currentPermission; // No change in other cases.
      }

      return {
        ...prevPermissions,
        [mode]: {
          ...prevPermissions[mode],
          [key]: newPermission
        }
      };
    });
  };

  return (
    <div className="App">

      <div className="table-container">
        <Table>  {/* Add right margin to the table */}
          <TableHead>
            <TableRow>
              <TableCell align="center">UI Controls</TableCell>
              <TableCell>Key</TableCell>
              <TableCell align="center" style={{ width: '60px' }}>EditMode</TableCell>
              <TableCell align="center" style={{ width: '60px' }}>EditMode</TableCell>
              <TableCell align="center" style={{ width: '60px' }}>ViewMode</TableCell>
              <TableCell align="center" style={{ width: '60px' }}>ViewMode</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center" style={{ width: '60px' }}>Read</TableCell>
              <TableCell align="center" style={{ width: '60px' }}>Write</TableCell>
              <TableCell align="center" style={{ width: '60px' }}>Read</TableCell>
              <TableCell align="center" style={{ width: '60px' }}>Write</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(initialPermissions.editMode).map(key => (
              <TableRow key={key} className="table-row-hover">
                <TableCell ><img src={`/images/${key}.png`} alt="icon" width="300" /></TableCell>
                <TableCell className="key-cell">{key}</TableCell>
                <TableCell style={{ width: '60px' }}>
                  <Switch
                    disabled={permissions.editMode[key] === 'write'}
                    checked={permissions.editMode[key].includes('read')}
                    onChange={() => handleToggleChange(key, 'editMode', 'read')}
                  />
                </TableCell>
                <TableCell style={{ width: '60px' }}>
                  <Switch
                    disabled={permissions.editMode[key] === '-'}
                    checked={permissions.editMode[key].includes('write')}
                    onChange={() => handleToggleChange(key, 'editMode', 'write')}
                  />
                </TableCell>
                <TableCell style={{ width: '60px' }}>
                  <Switch
                    disabled={permissions.viewMode[key] === 'write'}
                    checked={permissions.viewMode[key].includes('read')}
                    onChange={() => handleToggleChange(key, 'viewMode', 'read')}
                  />
                </TableCell>
                <TableCell style={{ width: '60px' }}>
                  <Switch
                    disabled={permissions.viewMode[key] === '-'}
                    checked={permissions.viewMode[key].includes('write')}
                    onChange={() => handleToggleChange(key, 'viewMode', 'write')}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


      <div
        className={isSidePanelOpen ? 'side-panel open' : 'side-panel'}
        onClick={() => setSidePanelOpen(true)} // Add onClick event directly here
      >
        <Button
          style={{ position: 'absolute', top: '50%', left: -30, transform: 'translateY(-50%)', zIndex: 1 }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up to the parent div
            setSidePanelOpen(true);
          }}
        >
          &lt;
        </Button>
        <Button
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up to the parent div
            setSidePanelOpen(false);
          }}
        >
          X
        </Button>
        <pre>{JSON.stringify(permissions, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
