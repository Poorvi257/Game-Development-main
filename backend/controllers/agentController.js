const pool = require('../config/database');

const agentController = {
    async getAllAgents(req, res) {
        try {
            const [agents] = await pool.query('SELECT * FROM agents ORDER BY role_name;');
            res.status(200).send(agents);
        } catch (error) {
            console.error("Get All Agents Error:", error);
            res.status(500).send({ error: "Unable to retrieve agents due to an internal error." });
        }
    },

    async insertLockedAgent(req, res) {
        try {
            const { userId, agentId } = req.body;
            if (!userId || !agentId) {
                return res.status(400).send({ error: "Missing userId or agentId in request." });
            }

            const gameStartTime = new Date();
            const insertQuery = `
                INSERT INTO user_selections (user_id, agent_id, game_start_time) VALUES (?, ?, ?);
            `;

            await pool.query(insertQuery, [userId, agentId, gameStartTime]);
            res.status(200).send({ message: "Agent locked successfully." });
        } catch (error) {
            console.error("Lock Agent Error:", error);
            res.status(500).send({ error: "Unable to lock agent due to an internal error." });
        }
    },

    async getProfileWithHistory(req, res) {
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).send({ error: "Missing userId in request." });
            }

            const [users] = await pool.query('SELECT * FROM user_selections WHERE user_id = ?', [userId]);
            if (users.length === 0) {
                return res.status(404).send({ message: "You have no history, start playing!" });
            }

            res.status(200).json(users);
        } catch (error) {
            console.error("Get Profile Error:", error);
            res.status(500).send({ error: "Unable to retrieve profile due to an internal error." });
        }
    },
};

module.exports = agentController;
