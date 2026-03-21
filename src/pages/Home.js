import React, { useEffect, useState } from "react"; 
import Navbar from "../components/Navbar";
import Modal from "../components/Modal"; 
import { supabase } from "../supabaseClient";
import "./Home.css";

function Home() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  // Fetch tickets
  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("patron_orders")
      .select(
        "id, patron_name, patron_email, patron_phone, pickup_datetime, staff_name, file_location, total_cost, billed, plate_1, plate_2, plate_3, plate_4, plate_1_done, plate_2_done, plate_3_done, plate_4_done"
      )
      .order("pickup_datetime", { ascending: true });

    if (!error) setTickets(data || []);
    else setTickets([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Delete a ticket
  const handleDelete = async (id) => {
    const { error } = await supabase.from("patron_orders").delete().eq("id", id);
    if (!error) fetchTickets();
    setTicketToDelete(null);
  };

  // Update a ticket
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { id, ...fields } = editingTicket;
    const { error } = await supabase.from("patron_orders").update(fields).eq("id", id);
    if (!error) {
      setEditingTicket(null);
      fetchTickets();
    } else {
      alert("Failed to update ticket.");
    }
  };

  // Toggle plate status
  const togglePlateDone = async (ticketId, plateField, currentValue) => {
    const { error } = await supabase
      .from("patron_orders")
      .update({ [plateField]: !currentValue })
      .eq("id", ticketId);
    if (!error) fetchTickets();
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1>Patron Orders</h1>

        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <h2>{ticket.patron_name}</h2>
                <p><strong>Email:</strong> {ticket.patron_email}</p>
                <p><strong>Phone:</strong> {ticket.patron_phone || "N/A"}</p>
                <p><strong>Pickup:</strong> {new Date(ticket.pickup_datetime).toLocaleString()}</p>
                <p><strong>Staff:</strong> {ticket.staff_name || "N/A"}</p>
                <p><strong>File Location:</strong> {ticket.file_location || "N/A"}</p>
                <p><strong>Total Cost:</strong> {ticket.total_cost ? `$${ticket.total_cost}` : "N/A"}</p>
                <p><strong>Billed:</strong> {ticket.billed ? "Yes" : "No"}</p>
                
                <div>
                  <strong>Plates:</strong>
                  <div className="plates-status">
                    {[1,2,3,4].map((i) => {
                      const plateName = ticket[`plate_${i}`];
                      const plateDone = ticket[`plate_${i}_done`];
                      if (!plateName) return null;
                      return (
                        <div key={i} className="plate-status">
                          <input
                            type="checkbox"
                            checked={plateDone || false}
                            onChange={() => togglePlateDone(ticket.id, `plate_${i}_done`, plateDone)}
                          />
                          <span className={plateDone ? "done" : "printing"}>
                            {plateName} {plateDone ? "(Done)" : "(Printing)"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="card-actions">
                  <button onClick={() => setEditingTicket(ticket)}>Edit</button>
                  <button onClick={() => setTicketToDelete(ticket)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Ticket Modal */}
        {editingTicket && (
          <Modal
            title="Edit Ticket"
            onClose={() => setEditingTicket(null)}
            buttons={[
              { label: "Save and Exit", className: "save-exit-button", onClick: handleEditSubmit },
              { label: "Cancel", className: "cancel-button", onClick: () => setEditingTicket(null) },
            ]}
          >
            <form className="create-post-form">
              <label>Patron Name
                <input
                  type="text"
                  value={editingTicket.patron_name}
                  onChange={(e) => setEditingTicket({ ...editingTicket, patron_name: e.target.value })}
                />
              </label>
              <label>Patron Email
                <input
                  type="email"
                  value={editingTicket.patron_email}
                  onChange={(e) => setEditingTicket({ ...editingTicket, patron_email: e.target.value })}
                />
              </label>
              <label>Patron Phone
                <input
                  type="tel"
                  value={editingTicket.patron_phone}
                  onChange={(e) => setEditingTicket({ ...editingTicket, patron_phone: e.target.value })}
                />
              </label>
              <label>Pickup Date/Time
                <input
                  type="datetime-local"
                  value={editingTicket.pickup_datetime.slice(0, 16)}
                  onChange={(e) => setEditingTicket({ ...editingTicket, pickup_datetime: e.target.value })}
                />
              </label>
              <label>Staff Name
                <input
                  type="text"
                  value={editingTicket.staff_name}
                  onChange={(e) => setEditingTicket({ ...editingTicket, staff_name: e.target.value })}
                />
              </label>
              <label>File Location
                <input
                  type="text"
                  value={editingTicket.file_location}
                  onChange={(e) => setEditingTicket({ ...editingTicket, file_location: e.target.value })}
                />
              </label>
              <label>Total Cost
                <input
                  type="number"
                  value={editingTicket.total_cost}
                  onChange={(e) => setEditingTicket({ ...editingTicket, total_cost: e.target.value })}
                />
              </label>
              <label>Billed
                <input
                  type="checkbox"
                  checked={editingTicket.billed}
                  onChange={(e) => setEditingTicket({ ...editingTicket, billed: e.target.checked })}
                />
              </label>
              <label>Plates:</label>
              {[1,2,3,4].map((i) => (
                <input
                  key={i}
                  type="text"
                  value={editingTicket[`plate_${i}`] || ""}
                  onChange={(e) => setEditingTicket({ ...editingTicket, [`plate_${i}`]: e.target.value })}
                  placeholder={`Plate ${i}`}
                />
              ))}
            </form>
          </Modal>
        )}

        {/* Delete Modal */}
        {ticketToDelete && (
          <Modal
            title="Confirm Delete"
            onClose={() => setTicketToDelete(null)}
            buttons={[
              { label: "Yes, Delete", className: "delete-button", onClick: () => handleDelete(ticketToDelete.id) },
              { label: "Cancel", className: "cancel-button", onClick: () => setTicketToDelete(null) },
            ]}
          >
            <p>Are you sure you want to delete the ticket for <strong>{ticketToDelete.patron_name}</strong>?</p>
          </Modal>
        )}

      </div>
    </>
  );
}

export default Home;