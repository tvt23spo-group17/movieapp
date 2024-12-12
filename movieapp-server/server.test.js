import { expect } from 'chai';
import request from 'supertest';
import app from './server.js';
import { initializeDb, insertTestUser, insertMovieMapping, insertReview } from './testHelper.js';

describe('Tests', () => {
  before(async () => {
    await initializeDb();
    await insertTestUser('test@example.com', 'TestPassword123');
  });

  describe('1. Kirjautuminen - POST /login', () => {
    it('should log in successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123'
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('accessToken');
      expect(response.body).to.have.property('refreshToken');
      expect(response.body).to.have.property('user');
      expect(response.body.user.email).to.equal('test@example.com');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Invalid email or password');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'AnyPass'
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Invalid email or password');
    });
  });

  describe('2. Uloskirjautuminen - POST /logout', () => {
    let validRefreshToken;

    before(async () => {
      await initializeDb();
      await insertTestUser('test@example.com', 'TestPassword123');
      const loginRes = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'TestPassword123' });

      expect(loginRes.status).to.equal(200);
      expect(loginRes.body).to.have.property('refreshToken');

      validRefreshToken = loginRes.body.refreshToken;
    });

    it('should fail if token is not provided', async () => {
      const response = await request(app)
        .post('/logout')
        .send({});
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Token is required');
    });

    it('should logout successfully with a valid token', async () => {
      const response = await request(app)
        .post('/logout')
        .send({ token: validRefreshToken });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Logged out successfully');
    });

    it('should return success even if the token is used again', async () => {
      const response = await request(app)
        .post('/logout')
        .send({ token: validRefreshToken });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Logged out successfully');
    });

    it('should return 200 even for an invalid token', async () => {
      const response = await request(app)
        .post('/logout')
        .send({ token: 'someInvalidToken123' });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Logged out successfully');
    });
  });

  describe('3. Rekisteröityminen - POST /register', () => {
    const validEmail = 'newuser@example.com';
    const validPassword = 'Password123';
    const invalidPassword = 'password';

    it('should register a user with valid credentials', async () => {
      const response = await request(app)
        .post('/register')
        .send({ email: validEmail, password: validPassword });
        
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('User registered successfully');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('id');
      expect(response.body.user.email).to.equal(validEmail);
    });

    it('should fail if user already exists with the same email', async () => {
      const response = await request(app)
        .post('/register')
        .send({ email: validEmail, password: validPassword });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('User already exists with this email');
    });

    it('should fail if the password does not meet the requirements', async () => {
      const response = await request(app)
        .post('/register')
        .send({ email: 'anotheruser@example.com', password: invalidPassword });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal("Password doesn't meet the requirements");
    });
  });

  describe('4. Rekisteröitymisen poistaminen - DELETE /delete-account', () => {
    let accessToken;
    const userEmail = 'deleteuser@example.com';
    const userPassword = 'DeleteUserPass123';

    before(async () => {
      await initializeDb();
      await insertTestUser(userEmail, userPassword);
  
      const loginRes = await request(app)
        .post('/login')
        .send({ email: userEmail, password: userPassword });
  
      expect(loginRes.status).to.equal(200);
      expect(loginRes.body).to.have.property('accessToken');
      accessToken = loginRes.body.accessToken;
    });
  
    it('should fail if no token is provided', async () => {
      const response = await request(app)
        .delete('/delete-account')
        .send({ password: userPassword });
      expect([401,403]).to.include(response.status);
    });
  
    it('should fail if incorrect password is provided', async () => {
      const response = await request(app)
        .delete('/delete-account')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ password: 'WrongPassword' });
  
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Incorrect password');
    });
  
    it('should delete the account successfully with correct password', async () => {
      const response = await request(app)
        .delete('/delete-account')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ password: userPassword });
  
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Account deleted successfully');
    });
  });

describe('5. Arvostelujen selaaminen - GET /reviews/all-reviews', () => {

  before(async () => {
    await initializeDb();
    await insertTestUser('review@example.com', 'Password123');
    await insertMovieMapping('Test Movie', 2021, 12345);
    await insertReview(1, 12345, 'Great movie!', 5);
  });
    

  it('should fetch all reviews and include the inserted review', async () => {
    const response = await request(app)
      .get('/reviews/all-reviews')
      .expect(200);

    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.at.least(1);

    const insertedReview = response.body.find(r => r.email === 'review@example.com' && r.local_title === 'Test Movie');
    expect(insertedReview).to.exist;
    expect(insertedReview.text).to.equal('Great movie!');
    expect(insertedReview.stars).to.equal(5);
    expect(insertedReview).to.have.property('timestamp');
  });

  it('should return an empty array if no reviews are present', async () => {
    await initializeDb();

    const response = await request(app)
      .get('/reviews/all-reviews')
      .expect(200);

    expect(response.body).to.be.an('array');
    expect(response.body.length).to.equal(0);
  });
});
});
