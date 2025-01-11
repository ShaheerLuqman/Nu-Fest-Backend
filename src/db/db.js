const createCompetitionsTable = async () => {
  const query = `
        CREATE TABLE if not exists competitions (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            date DATE NOT NULL,
            category_id INT REFERENCES categories(cat_id) ON DELETE SET NULL, 
            UNIQUE (name, category_id) 
        );
    `;
  return query;
};

const createCategoryTable = async () => {
  const query = `
            CREATE TABLE if not exists categories (
                cat_id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL
            );
        `;
  return query;
};
const createParticipantTable = async () => {
  const query = `
        CREATE TABLE if not exists participants (
            part_id SERIAL PRIMARY KEY,
            part_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            team_id INT REFERENCES teams(team_id) ON DELETE CASCADE,
            competition_id INT REFERENCES competitions(id) ON DELETE CASCADE
        );
    `;
  return query;
};
const createTeamTable = async () => {
  const query = `
        CREATE TABLE if not exists teams (
            team_id SERIAL PRIMARY KEY,
            team_name VARCHAR(100) NOT NULL,
            competition_id INT REFERENCES competitions(id),
            payment_screenshot VARCHAR(255) NOT NULL,
            UNIQUE (team_name, competition_id) 
        );
    `;
  return query;
};
export const createTables = async (pool) => {
  try {
    // fetching queries from functions(strings)
    const competitionsTableQuery = await createCompetitionsTable();
    const createTeamTableQuery = await createTeamTable();
    const createParticipantTableQuery = await createParticipantTable();
    const createCategoryTableQuery = await createCategoryTable();

    // executing queries here
    await pool.query(createCategoryTableQuery);
    await pool.query(competitionsTableQuery);
    await pool.query(createTeamTableQuery);
    await pool.query(createParticipantTableQuery);
  } catch (error) {
    console.error("Error creating tables: ", error);
  }
};
