import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../styles/EditTicketModal.css';

const EditTicketModal = ({ ticket, onClose, onUpdate }) => {
  const [newIssue, setNewIssue] = useState(ticket.issue || '');
  const [newStatus, setNewStatus] = useState(ticket.status || 'To Do');
  const [assignedStaff, setAssignedStaff] = useState(ticket.misStaff ? ticket.misStaff.id : '');
  const [misStaffList, setMisStaffList] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Fetch the list of MIS staff
  useEffect(() => {
    const fetchMisStaff = async () => {
      try {
        const response = await axios.get('https://true-weevil-hardly.ngrok-free.app/MisStaffService/staff', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMisStaffList(response.data);
      } catch (error) {
        setMessageType('error');
        setMessage('Failed to fetch MIS staff. Please try again later.');
      }
    };

    fetchMisStaff();
  }, []);

  // Handle the form submission to update the ticket
  const handleUpdateTicket = async () => {
    const updateData = {
      ticketId: ticket.ticketId,
      issue: newIssue || ticket.issue, // Keep original if new issue is empty
      status: newStatus || ticket.status, // Keep original if new status is empty
      misStaff: assignedStaff ? { staffId: assignedStaff } : ticket.misStaff, // Only update staff if a new one is selected
    };

    // If the status is set to "Done" or "Closed," generate the dateFinished
    if (newStatus === 'Done' || newStatus === 'Closed') {
      updateData.dateFinished = new Date().toISOString(); // Current date in ISO format
    }

    // Validation checks
    if (!updateData.issue || !updateData.status) {
      setMessageType('error');
      setMessage('Issue and status are required fields!');
      return;
    }

    try {
      const response = await axios.put(
        `https://true-weevil-hardly.ngrok-free.app/TicketService/ticket/update/${ticket.ticketId}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        setMessageType('success');
        setMessage('Ticket updated successfully!');
        if (typeof onUpdate === 'function') {
          onUpdate(); // Notify parent to refresh the ticket list or other related actions
        }
        onClose(); // Close the modal after updating
      } else {
        setMessageType('error');
        setMessage('Failed to update the ticket. Please try again.');
      }
    } catch (error) {
      setMessageType('error');
      if (error.response) {
        setMessage(`Error: ${error.response.data.message || 'An error occurred.'}`);
      } else {
        setMessage('Failed to update the ticket. Please try again later.');
      }
    }
  };

  // Handle staff selection change
  const handleStaffSelection = (e) => {
    setAssignedStaff(e.target.value);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Ticket</h2>
        <div>
          <label>Issue:</label>
          <input
            type="text"
            value={newIssue}
            onChange={(e) => setNewIssue(e.target.value)}
            placeholder="Enter issue description"
            disabled // Issue is not editable here as per your setup (uncomment if it's editable)
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div>
          <label>Assigned MIS Staff:</label>
          <select value={assignedStaff} onChange={handleStaffSelection}>
            <option value="">Unassigned</option>
            {misStaffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {`${staff.firstName} ${staff.lastName}`}
              </option>
            ))}
          </select>
        </div>
        {message && <div className={`message ${messageType}`}>{message}</div>}
        <div className="modal-actions">
          <button onClick={handleUpdateTicket}>Update Ticket</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

EditTicketModal.propTypes = {
  ticket: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditTicketModal;
