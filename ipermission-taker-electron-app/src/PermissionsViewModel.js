import { useState, useEffect } from 'react';
import axios from 'axios';

const defaultPermissions = {
  buttonCreate: 'readwrite',
  buttonEdit: 'readwrite',
  buttonDelete: 'readwrite',
  textFieldTitle: 'readwrite',
  pickerStartDateTime: 'readwrite',
  selectorDuration: 'readwrite',
  selectorRepeat: 'readwrite',
  selectorAttendee: 'readwrite',
  editorAttachment: 'readwrite',
  textFieldDesc: 'readwrite',
  checkboxEveryoneCanModifyMeeting: 'readwrite',
  checkboxEveryoneCanInviteOthers: 'readwrite',
  checkboxSendInvitationToTheChatRoom: 'readwrite',
  toggleGoingOrNot: 'readwrite',
  checkboxReceiveNotification: 'readwrite',
};

const usePermissionsViewModel = () => {
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [error, setError] = useState(null);

  const fetchPermissionsAsync = async () => {
    try {
      const response = await axios.get('http://localhost:8080/permissions');
      const decodedPermissions = response.data;

      if (decodedPermissions.editMode) {
        setPermissions(decodedPermissions.editMode);
      } else {
        throw new Error('PermissionDecoding');
      }
    } catch (error) {
      setError(error);
      setPermissions(defaultPermissions);
    }
  };

  useEffect(() => {
    fetchPermissionsAsync();
  }, []);

  return {
    permissions,
    error,
  };
};

export default usePermissionsViewModel;
