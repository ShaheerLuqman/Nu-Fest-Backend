import pool from "../server.js";

export const getCategories = async (req, res) => {
  const getCategoriesQuery = `SELECT * FROM nufest.categories`;
  try {
    const result = await pool.query(getCategoriesQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to get categories", error: error.message });
  }
};
export const getCategoryName = async (req, res) => {
  //   const getCategoriesQuery = `SELECT * FROM nufest.categories as category JOIN nufest.competitions as competition ON comp.category_id = cat.cat_id where cat.name = $1`;
  const getCategoriesQuery = `
    SELECT
      c.id,
      c.name AS competition_name,
      c.description,
      c.date,
      c.number_of_teams,
      cat.name AS category_name
    FROM nufest.competitions AS c
    JOIN nufest.categories AS cat ON c.category_id = cat.cat_id where cat.name = $1;
  `;
  try {
    const name = req.query.name;
    const result = await pool.query(getCategoriesQuery, [name]);
    if (result.rows.length === 0) {
      return res.status(402).json({ message: "Category does not exist" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to get categories", error: error.message });
  }
};

// export const addCategory = async (req, res) => {
//   const getCategoryQuery = `SELECT * FROM categories WHERE name = $1`;
//   const addCategoryQuery = `INSERT INTO categories (name) VALUES ($1)`;
//   try {
//     const result = await pool.query(getCategoryQuery, [req.body.name]);
//     if (result.rows.length > 0) {
//       return res.status(400).json({ message: "Category already exists" });
//     }
//     const { name } = req.body;
//     await pool.query(addCategoryQuery, [name]);
//     res.status(201).json({ message: "Category added successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to add category", error: error.message });
//   }
// };
