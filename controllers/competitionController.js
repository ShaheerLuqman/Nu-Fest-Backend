import pool from "../server.js";

export const getCompetitions = async (req, res) => {
  const getCompetitionQuery = `
    SELECT 
      c.id, 
      c.name AS competition_name, 
      c.description, 
      c.date, 
      c.number_of_teams, 
      cat.name AS category_name,
      c.imageurl,
      maxplayersperteam,
      minplayersperteam
    FROM competition AS c
    LEFT JOIN category AS cat ON c.category_id = cat.cat_id;
  `;

  try {
    const result = await pool.query(getCompetitionQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get competitions", error: error.message });
  }
};

export const getCompetitionCategory = async (req, res) => {
  const getCompetitionCategoryQuery = `
    SELECT
      c.id,
      c.name AS competition_name,
      c.description,
      c.date,
      c.number_of_teams,
      cat.name AS category_name
    FROM competition AS c
    JOIN category AS cat ON c.category_id = cat.cat_id where cat.name = $1;
  `;

  try {
    const name = req.body.cat_name;
    const result = await pool.query(getCompetitionCategoryQuery, [name]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Category does not exist" });
    }
    res.status(200).json(result.rows);
  } catch (error) {}
};

// export const addCompetition = async (req, res) => {
//   const getCompetitionQuery = `SELECT * FROM competitions WHERE name = $1`;
//   const addCompetitionQuery = `INSERT INTO competitions (name, category_id, description, date) VALUES ($1, $2, $3, $4)`;
//   try {
//     const result = await pool.query(getCompetitionQuery, [req.body.name]);
//     if (!result.rows[0]) {
//       return res.status(400).json({ message: "Competition already exists" });
//     }
//     const { name, category_id, description, date } = req.body;
//     await pool.query(addCompetitionQuery, [
//       name,
//       category_id,
//       description,
//       date,
//     ]);
//     res.status(201).json({ message: "Competition added successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to add competition", error: error.message });
//   }
// };