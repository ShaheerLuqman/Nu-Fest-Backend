const createCompetitionsTable = async () => {
  const query = `
        CREATE TABLE if not exists competition (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            number_of_teams int default 0,
            imageurl varchar(255),
            maxplayersperteam INT default 1,
            minplayersperteam int default 1,
            price integer default 0,
            category_id INT REFERENCES category(cat_id) ON DELETE SET NULL, 
            UNIQUE (name, category_id) 
        );
    `;
  return query;
};

const createCategoryTable = async () => {
  const query = `
            CREATE TABLE if not exists category (
                cat_id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                imageurl varchar(255)
            );
        `;
  return query;
};
const createParticipantTable = async () => {
  const query = `
        CREATE TABLE if not exists participant (
            part_id SERIAL PRIMARY KEY,
            part_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            team_id INT not null REFERENCES team(team_id) ON DELETE CASCADE,
            competition_id INT not null REFERENCES competition(id) ON DELETE CASCADE
        );
    `;
  return query;
};
const createTeamTable = async () => {
  const query = `
        CREATE TABLE if not exists team (
            team_id SERIAL PRIMARY KEY,
            team_name VARCHAR(100) NOT NULL,
            competition_id INT not null REFERENCES competition(id),
            payment_screenshot VARCHAR(255) NOT NULL,
            team_leader_id INT NOT NULL,
            team_leader_phone varchar(15) not null,
            UNIQUE (team_name, competition_id) 
        );
    `;
  return query;
};

const createEventTable = async () => {
  const query = `
      CREATE TABLE if not exists event (
          id SERIAL PRIMARY KEY,
          event_name VARCHAR(100) NOT NULL,
          description TEXT,
          imageurl varchar(255),
          no_of_tickets integer default 0
      );
    `;
  return query;
};

const createEventParticipantsTable = async () => {
  const query = `
      CREATE TABLE if not exists event_participant (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(15) NOT NULL,
          payment_screenshot TEXT,
          event_id INT not null REFERENCES event(id) ON DELETE CASCADE
      );
    `;
  return query;
};

export const createTables = async (pool) => {
  try {
    // fetching queries from functions(strings)
    const eventTableQuery = await createEventTable();
    const eventParticipantsTableQuery = await createEventParticipantsTable();
    const competitionsTableQuery = await createCompetitionsTable();
    const createTeamTableQuery = await createTeamTable();
    const createParticipantTableQuery = await createParticipantTable();
    const createCategoryTableQuery = await createCategoryTable();

    // executing queries here
    await pool.query(createCategoryTableQuery);
    await pool.query(competitionsTableQuery);
    await pool.query(createTeamTableQuery);
    await pool.query(createParticipantTableQuery);
    await pool.query(eventTableQuery);
    await pool.query(eventParticipantsTableQuery);
  } catch (error) {
    console.error("Error creating tables: ", error);
  }
};