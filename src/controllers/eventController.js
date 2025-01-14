import pool from "../server.js";

export const getEvents = async (req, res) => {
  const getEventQuery = `
      SELECT 
        id, 
        name AS event_name, 
        imageurl, 
        description,
        date
      FROM nufest.events;
    `;
  try {
    const result = await pool.query(getEventQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get events", error: error.message });
  }
};
export const getEventTickets = async (req, res) => {
  const getEventQuery = `
      SELECT 
        count(*) as tickets_sold, event.name AS event_name from nufest.events as event join nufest.event_participants as event_participants on event.id = event_participants.event_id group by event.name; 
    `;
  try {
    const name = req.query.name;
    const result = await pool.query(getEventQuery, [name]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get events", error: error.message });
  }
};

export const addEventParticipant = async (req, res) => {
  const insertParticipantQuery = `
    INSERT INTO nufest.event_participants (name, email, phone, event_id, payment_screenshot)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;
  const checkEmailQuery = `
    SELECT * 
    FROM nufest.event_participants 
    WHERE email = $1 AND event_id = $2;
  `;

  try {
    const { name, email, phone, event_id, payment_screenshot } = req.body;

    // Validate input
    if (!name || !email || !phone || !event_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email is already registered for the same event
    const emailCheck = await pool.query(checkEmailQuery, [email, event_id]);

    if (emailCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "This email is already registered for the event." });
    }

    // Insert the new participant
    const result = await pool.query(insertParticipantQuery, [
      name,
      email,
      phone,
      event_id,
      payment_screenshot
    ]);

    res.status(201).json({
      message: "Participant added successfully",
      participantId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error adding event participant:", error);
    res
      .status(500)
      .json({ message: "Failed to add participant", error: error.message });
  }
};