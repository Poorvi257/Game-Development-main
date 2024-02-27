const supertest = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

jest.mock('../config/database', () => ({
  query: jest.fn()
}));
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fakeToken')
}));

const authController = require('../controllers/authController');

const app = express();
app.use(express.json());
app.post('/register', authController.register);
app.post('/login', authController.login);

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Register', () => {
    it('should return 400 for missing username or password', async () => {
      const response = await supertest(app)
        .post('/register')
        .send({ username: '', password: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("username and password are required");
    });

    it('should return 400 for short password', async () => {
      const response = await supertest(app)
        .post('/register')
        .send({ username: 'testUser', password: 'short' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Password is too short");
    });

    it('should return 400 if user already exists', async () => {
      pool.query.mockResolvedValueOnce([[{ id: 1 }]]); // Simulate existing user

      const response = await supertest(app)
        .post('/register')
        .send({ username: 'testUser', password: 'securePassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User already exists");
    });

    it('should successfully register a new user', async () => {
      pool.query.mockResolvedValueOnce([[]]).mockResolvedValueOnce([{ insertId: 1 }]).mockResolvedValueOnce([[{ id: 1, username: 'testUser' }]]);

      const response = await supertest(app)
        .post('/register')
        .send({ username: 'newUser', password: 'securePassword123' });

      expect(response.status).toBe(201);
      expect(response.body.user).toEqual({ id: 1, username: 'testUser' });
      expect(response.body.token).toBeDefined();
    });
  });

  describe('Login', () => {
    it('should return 401 for non-existent user', async () => {
      pool.query.mockResolvedValueOnce([[]]); // Simulate user not found

      const response = await supertest(app)
        .post('/login')
        .send({ username: 'unknownUser', password: 'anyPassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authentication failed");
    });

    it('should return 401 for incorrect password', async () => {
      bcrypt.compare.mockResolvedValueOnce(false); // Simulate password mismatch
      pool.query.mockResolvedValueOnce([[{ id: 1, username: 'testUser', password: 'hashedPassword' }]]);

      const response = await supertest(app)
        .post('/login')
        .send({ username: 'testUser', password: 'wrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authentication failed");
    });

    it('should successfully log in a user', async () => {
      bcrypt.compare.mockResolvedValueOnce(true); // Simulate password match
      pool.query.mockResolvedValueOnce([[{ id: 1, username: 'testUser', password: 'hashedPassword' }]]);

      const response = await supertest(app)
        .post('/login')
        .send({ username: 'testUser', password: 'correctPassword' });

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual({ id: 1, username: 'testUser', password: 'hashedPassword' });
      expect(response.body.token).toBeDefined();
    });
  });
});
