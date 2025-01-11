import { db } from "../server.js";

// export const getTeams = async (req, res) => {
//   const getTeamsQuery = `SELECT * FROM teams`;
//   try {
//     const result = await db.query(getTeamsQuery);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Failed to get teams", error: error.message });
//   }
// };

//code
//305 means team already exists
//306 means participants already exists
//307 means leader already exists
//

export const addTeam = async (req, res) => {
  const addTeamQuery = `
    INSERT INTO nufest.team (team_name, competition_id, payment_screenshot, team_leader_id, team_leader_phone) 
    VALUES ($1, $2, $3, NULL, $4) 
    RETURNING team_id;
  `;
  const addParticipantQuery = `
    INSERT INTO nufest.participant (part_name, email, competition_id, team_id) 
    VALUES ($1, $2, $3, $4) 
    RETURNING part_id;
  `;
  const updateTeamLeaderQuery = `
    UPDATE nufest.team 
    SET team_leader_id = $1 
    WHERE team_id = $2;
  `;
  const checkTeamQuery = `
    SELECT * 
    FROM nufest.team 
    WHERE team_name = $1 AND competition_id = $2;
  `;
  const checkParticipantQuery = `
    SELECT * 
    FROM nufest.participant 
    WHERE email = ANY($1::text[]) AND competition_id = $2;
  `;

  const teamLeaderExistsQuery = `
    SELECT part_id 
    FROM nufest.participant 
    WHERE email = $1 AND competition_id = $2;
  `;

  try {
    const { team_name, competition_id, payment_screenshot, team_leader, participants } = req.body;

    // Validate input
    if (!team_leader || !team_leader.name || !team_leader.email || !team_leader.phone) {
      return res.status(400).json({ message: "Team leader information is required" });
    }

    // Check if the team already exists and participants as well
    const teamExists = await db.query(checkTeamQuery, [team_name, competition_id]);
    if (teamExists.rows.length > 0) {
      return res.status(305).json({ message: "Team already exists" });
    }
    //Check if the participants already exists
    if (participants && participants.length > 0) {

        const participantEmails = participants.map((p) => p.email);
        const existingParticipants = await db.query(checkParticipantQuery, [
          participantEmails,
          competition_id,
        ]);

        if (existingParticipants.rows.length > 0) {
          return res.status(306).json({
            message: "Some participants are already registered",
            existingParticipants: existingParticipants.rows.map((p) => ({ email: p.email })),
          });
        }
    }
    const existingTeamLeader = await db.query(teamLeaderExistsQuery, [
      team_leader.email.toLowerCase(),
      competition_id,
    ]);

    if (existingTeamLeader.rows.length > 0) {
      // Use the existing participant ID
      return res.status(307).json({
        message: "Team Leader is already registered",
      });
    }
    
    // Step 1: Insert the team (without leader ID initially)
    const teamResult = await db.query(addTeamQuery, [
      team_name,
      competition_id,
      payment_screenshot,
      team_leader.phone,
    ]);
    const teamId = teamResult.rows[0].team_id;

    // Step 2: Add the team leader as a participant and retrieve their part_id
    const leaderResult = await db.query(addParticipantQuery, [
      team_leader.name,
      team_leader.email,
      competition_id,
      teamId
    ]);
    const teamLeaderId = leaderResult.rows[0].part_id;

    console.log("participantEmails:", participants);
    console.log("competition_id:", competition_id);

    // Step 3: Update the team with the team leader ID
    await db.query(updateTeamLeaderQuery, [teamLeaderId, teamId]);

    // Step 4: Add other participants
    if (participants && participants.length > 0) {
      

      for (const participant of participants) {
        const { name, email } = participant;
        await db.query(addParticipantQuery, [name, email, competition_id, teamId]);
      }
    }

    res.status(201).json({ message: "Team added successfully" });
  } catch (error) {
    console.error("Error adding team:", error);
    res.status(500).json({ message: "Failed to add team", error: error.message });
  }
};



