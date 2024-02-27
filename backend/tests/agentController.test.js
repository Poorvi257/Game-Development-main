const { getAllAgents } = require('../controllers/agentController'); // Adjust the path as necessary

jest.mock('../config/database', () => ({
    query: jest.fn()
}));

const pool = require('../config/database'); // Ensure this path matches the path used in your controller

describe('getAllAgents', () => {
    beforeEach(() => {
        // Clears the mock.calls and mock.instances properties of all mocks
        jest.clearAllMocks();
    });

    it('should return all agents successfully', async () => {
        // Mocking the successful database response
        const mockAgents = [
            { id: 1, name: 'Agent 1', role_name: 'Role 1' },
            { id: 2, name: 'Agent 2', role_name: 'Role 2' }
        ];
        pool.query.mockResolvedValue([mockAgents, []]);

        // Mocking Express request and response
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await getAllAgents(req, res);

        // Assertions
        expect(pool.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(mockAgents);
    });

    it('should handle a database error', async () => {
        // Simulating a database error
        pool.query.mockRejectedValue(new Error('Database error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        await getAllAgents(req, res);

        // Assertions
        expect(pool.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ error: "Unable to retrieve agents due to an internal error." });
    });
});

const { insertLockedAgent } = require('../controllers/agentController'); // Adjust the path as necessary

describe('insertLockedAgent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should insert the agent successfully for valid userId and agentId', async () => {
        // Arrange
        const req = {
            body: {
                userId: 'user123',
                agentId: 'agent456'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        pool.query.mockResolvedValue({ affectedRows: 1 }); // Simulate successful insert

        // Act
        await insertLockedAgent(req, res);

        // Assert
        expect(pool.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: "Agent locked successfully." });
    });

    it.each([
        [{}, "Missing userId or agentId in request."],
        [{ userId: 'user123' }, "Missing userId or agentId in request."],
        [{ agentId: 'agent456' }, "Missing userId or agentId in request."]
    ])('should return status 400 for missing userId or agentId', async (body, expectedMessage) => {
        // Arrange
        const req = { body };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        // Act
        await insertLockedAgent(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ error: expectedMessage });
    });

    it('should handle a database error during insert', async () => {
        // Arrange
        const req = {
            body: {
                userId: 'user123',
                agentId: 'agent456'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        pool.query.mockRejectedValue(new Error('Database insert error')); // Simulate database error

        // Act
        await insertLockedAgent(req, res);

        // Assert
        expect(pool.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ error: "Unable to lock agent due to an internal error." });
    });
});

const { getProfileWithHistory } = require('../controllers/agentController'); // Adjust the path as necessary

describe('getProfileWithHistory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the user selection history for a valid userId', async () => {
        // Arrange
        const req = {
            params: {
                userId: 'user123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockHistoryData = [{ id: 1, user_id: 'user123', agent_id: 'agent456', game_start_time: new Date() }];
        pool.query.mockResolvedValue([mockHistoryData]); // Simulate database returning history data

        // Act
        await getProfileWithHistory(req, res);

        // Assert
        expect(pool.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHistoryData);
    });

    it('should return status 400 for missing userId parameter', async () => {
        // Arrange
        const req = { params: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        // Act
        await getProfileWithHistory(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ error: "Missing userId in request." });
    });

    it('should return status 404 when no history is found for the userId', async () => {
        // Arrange
        const req = {
            params: {
                userId: 'user123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        pool.query.mockResolvedValue([[]]); // Simulate database returning empty history

        // Act
        await getProfileWithHistory(req, res);

        // Assert
        expect(pool.query).toHaveBeenCalledWith(expect.anything(), [req.params.userId]);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ message: "You have no history, start playing!" });
    });

    it('should handle a database error during profile retrieval', async () => {
        // Arrange
        const req = {
            params: {
                userId: 'user123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        pool.query.mockRejectedValue(new Error('Database error')); // Simulate database error

        // Act
        await getProfileWithHistory(req, res);

        // Assert
        expect(pool.query).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ error: "Unable to retrieve profile due to an internal error." });
    });
});
