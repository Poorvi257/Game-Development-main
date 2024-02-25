const mysql = require("mysql2/promise");
require("dotenv").config();
const axios = require('axios');

// Create the database if it doesn't exist
const createDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
  );

  console.log("Database created successfully");

  connection.end();
};

// Create the tables if they don't exist
const createTables = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const agentsTable = `
    CREATE TABLE IF NOT EXISTS agents (
      id VARCHAR(255) PRIMARY KEY,
      displayName VARCHAR(255) NOT NULL,
      role_name VARCHAR(255) NOT NULL,
      role_icon TEXT,
      image_url VARCHAR(255),
      abilities_icons TEXT
    )
  `;

  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      games_played INT DEFAULT 0
    )
  `;

  const userSelectionsTable = `
    CREATE TABLE IF NOT EXISTS user_selections (
      pk INT NOT NULL AUTO_INCREMENT,
      id VARCHAR(255) NOT NULL,
      user_id INT NOT NULL,
      agent_id VARCHAR(255) NOT NULL,
      game_start_time DATETIME,
      CONSTRAINT FK_user FOREIGN KEY (user_id) REFERENCES users (id),
      CONSTRAINT FK_agent FOREIGN KEY (agent_id) REFERENCES agents (id),
      PRIMARY KEY(pk),
      UNIQUE(id)
    )
  `;

  await connection.query(agentsTable);
  await connection.query(usersTable);
  await connection.query(userSelectionsTable);

  console.log("Tables created successfully");

  connection.end();
};

const insertAgents = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  const agentsData = await axios.get("https://valorant-api.com/v1/agents");
  const json = await agentsData.data;

  for (const agent of json.data) {
    // Debugging: Log each agent's displayName and role to understand the data structure

    if (!agent.displayName) {
      console.warn(
        `Display name missing for agent: ${agent.uuid}. Skipping agent.`
      );
      continue; // Skip this agent as the display name is crucial
    }

    if (!agent.role || !agent.role.displayName) {
      // If the role itself is missing
      if (!agent.role) {
        console.warn(`Role information missing for agent: ${agent.displayName}. Skipping agent.`);
      }
      // If the role exists but the displayName is missing
      else if (!agent.role.displayName) {
        console.warn(`Role display name missing for agent: ${agent.displayName}. Skipping agent.`);
      }
      continue; // Skip this agent as either the role or role's displayName is crucial
    }
    
    const insertQuery = `
        INSERT INTO agents (id, displayName, role_name, role_icon, image_url, abilities_icons) VALUES (?, ?, ?, ?, ?, ?);
      `;
    try {

      let abilities = agent.abilities.map(ability => ability.displayIcon).join(", ")

      await connection.query(insertQuery, [
        agent.uuid,
        agent.displayName,
        agent.role?.displayName,
        agent.role?.displayIcon,
        agent.displayIcon,
        abilities,
      ]);

    } catch (error) {
      console.error(`Error inserting agent: ${agent.displayName}`, error);
    }
  }
  connection.end()
};

// Run the migrations
const main = async () => {
  await createDatabase();
  await createTables();
  await insertAgents();
  // await insertUsers();

  console.log("Database migrations completed successfully.");
};

main().catch(console.error);
