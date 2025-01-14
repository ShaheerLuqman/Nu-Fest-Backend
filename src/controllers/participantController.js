import pool from "../server.js";

// export const addParticipant = async (req, res) => {
//   //   const getCompetitionQuery = `SELECT * FROM participants WHERE name = $1`;
//   //   const addCompetitionQuery = `INSERT INTO competitions (name, category_id, description, date) VALUES ($1, $2, $3, $4)`;
//   const getParticipantQuery = `SELECT * FROM participants WHERE email = $1 and competition_id = $2`;
//   const addParticipantQuery = `INSERT INTO participants (part_name, email, phone, team_id, competition_id) VALUES ($1, $2, $3, $4, $5)`;

//   try {
//     const result = await pool.query(getParticipantQuery, [
//       req.body.email,
//       req.body.competition_id,
//     ]);
//     if (!result.rows[0]) {
//       const { part_name, email, phone, team_id, competition_id } = req.body;
//       await pool.query(addParticipantQuery, [
//         part_name,
//         email,
//         phone,
//         team_id,
//         competition_id,
//       ]);
//     } else {
//       return res.status(400).json({ message: "Participant already exists" });
//     }
//     res.status(201).json({ message: "participant added successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to add participant", error: error.message });
//   }
// };


// // FETCH WITH ID
// export const getParticipant = async (req, res) => {
//   const getParticipantQuery = `SELECT * FROM participants WHERE email = $1 and competition_id = $1`;
//   try {
//     const result = await pool.query(getParticipantQuery, [
//       req.body.part_name,
//       req.body.competition_id,
//     ]);
//     if (!result.rows[0]) {
//       return res.status(400).json({ message: "Participant does not exist" });
//     }
//     res.status(200).json(result.rows);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to get participant", error: error.message });
//   }
// };


// // FETCH ALL
// export const getAllParticipants = async (req, res) => {
//   const getParticipantQuery = `SELECT * FROM participants`;
//   try {
//     const result = await pool.query(getParticipantQuery);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to get participants", error: error.message });
//   }
// };
