const pool = require('../config/database');

const agentController = {
    async getAllAgents(req, res) {
        try {
            const [agents] = await pool.query('SELECT * FROM agents');
            res.status(200).send(agents);
        } catch (error) {
            console.error("Get All Agents Error:", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    },

    async insertLockedAgent(req, res) {
        try {
            const { userId, agentId } = req.body; // Assuming these are passed in the request body
            const gameStartTime = new Date(); // Sets the current time; adjust as needed for your application logic

            const insertQuery = `
                INSERT INTO user_selections (user_id, agent_id, game_start_time) VALUES (?, ?, ?);
            `;

            await pool.query(insertQuery, [userId, agentId, gameStartTime]);

            res.status(201).send({ message: "Agent locked successfully" });
        } catch (error) {
            console.error("Lock Agent Error:", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
}

module.exports = agentController;