import React, { useState } from "react";
import Navbar from "../components/Navbar2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom"; 
import "./Create.css";

function CreateTicket() {
  const [formData, setFormData] = useState({
    patron_name: "",
    patron_email: "",
    patron_phone: "",
    pickup_datetime: "",
    staff_name: "",
    file_location: "",
    total_cost: "",
    billed: false,
  });

  const [plates, setPlates] = useState([""]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePlateChange = (index, value) => {
    const newPlates = [...plates];
    newPlates[index] = value;
    setPlates(newPlates);
  };

  const addPlate = () => {
    if (plates.length < 4) setPlates([...plates, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticketData = {
      patron_name: formData.patron_name,
      patron_email: formData.patron_email,
      patron_phone: formData.patron_phone,
      pickup_datetime: formData.pickup_datetime,
      staff_name: formData.staff_name,
      file_location: formData.file_location,
      total_cost: formData.total_cost,
      billed: formData.billed,
      plate_1: plates[0] || "",
      plate_2: plates[1] || "",
      plate_3: plates[2] || "",
      plate_4: plates[3] || "",
    };

    const { error } = await supabase
      .from("patron_orders")
      .insert([ticketData]);

    if (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Check console for details.");
    } else {
      // Reset form
      setFormData({
        patron_name: "",
        patron_email: "",
        patron_phone: "",
        pickup_datetime: "",
        staff_name: "",
        file_location: "",
        total_cost: "",
        billed: false,
      });
      setPlates([""]);

      // Redirect to home page
      navigate("/");
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-post-container">
        <h1>Create Ticket</h1>

        <form onSubmit={handleSubmit} className="create-post-form">
          <label>
            Patron Name*
            <input
              type="text"
              name="patron_name"
              value={formData.patron_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Patron Email
            <input
              type="email"
              name="patron_email"
              value={formData.patron_email}
              onChange={handleChange}
            />
          </label>

          <label>
            Patron Phone
            <input
              type="tel"
              name="patron_phone"
              value={formData.patron_phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Pickup Date/Time*
            <input
              type="datetime-local"
              name="pickup_datetime"
              value={formData.pickup_datetime}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Staff Name*
            <input
              type="text"
              name="staff_name"
              value={formData.staff_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            File Location
            <input
              type="text"
              name="file_location"
              value={formData.file_location}
              onChange={handleChange}
            />
          </label>

          <label>
            Total Cost*
            <input
              type="number"
              name="total_cost"
              value={formData.total_cost}
              onChange={handleChange}
              step="0.01"
              required
            />
          </label>

          <label>
            Billed
            <input
              type="checkbox"
              name="billed"
              checked={formData.billed}
              onChange={handleChange}
            />
          </label>

          {/* Plates */}
          <div className="plates-container">
            <label>Plates:</label>
            {plates.map((plate, index) => (
              <div key={index} className="plate-row">
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => handlePlateChange(index, e.target.value)}
                  placeholder={`Plate ${index + 1}`}
                  required={index === 0}
                />

                {index === plates.length - 1 && plates.length < 4 && (
                  <button
                    type="button"
                    className="add-plate-button"
                    onClick={addPlate}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateTicket;