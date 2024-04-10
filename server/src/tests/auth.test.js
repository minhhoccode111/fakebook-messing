const request = require('supertest');
const { describe, test, expect, beforeAll, afterAll} = require('bun:test');

const app = require('./setup');

describe.skip(`POST /signup`, () => {
  test(`valid signup`, async () => {
    const resSignup = await request(app).post('/api/v1/auth/signup').type('form').send({
      fullname: 'khong dieu kien',
      //
      username: 'khongdieukien@gmail.com',
      password: 'Bruh0!0!',
      'confirm-password': 'Bruh0!0!',
    });
    expect(resSignup.status).toEqual(200);
    expect(resSignup.headers['content-type']).toMatch(/json/);
    expect(resSignup.body.message).toMatch(/success/gi);
    expect(resSignup.body.user.fullname).toMatch(/khong dieu kien/gi);
    expect(resSignup.body.user.username).toMatch(/khongdieukien@gmail.com/gi);
  });

  test(`invalid username - short`, async () => {
    const res = await request(app).post('/api/v1/auth/signup').type('form').send({
      fullname: 'khong dieu kien',
      username: 'a@g.com', // short
      password: 'Bruh0!0!',
      'confirm-password': 'Bruh0!0!',
    });
    expect(res.status).toBe(400);
  });

  test(`invalid username - not email`, async () => {
    const res = await request(app).post('/api/v1/auth/signup').type('form').send({
      fullname: 'khong dieu kien',
      username: 'asdasdasd.gmail.com', // not email
      password: 'Bruh0!0!',
      'confirm-password': 'Bruh0!0!',
    });
    expect(res.status).toBe(400);
  });

  test(`invalid fullname`, async () => {
    const res = await request(app).post('/api/v1/auth/signup').type('form').send({
      fullname: '', // invalid
      username: 'asdasd@gmail.com',
      password: 'Bruh0!0!',
      'confirm-password': 'Bruh0!0!',
    });
    expect(res.status).toBe(400);
  });

  test(`invalid password - too short`, async () => {
    const res = await request(app).post('/api/v1/auth/signup').type('form').send({
      fullname: 'khong dieu kien',
      username: 'asdasd@gmail.com',
      password: 'Bruh0!', // short
      'confirm-password': 'Bruh0!0!',
    });
    expect(res.status).toBe(400);
  });

  test(`invalid password - not strong`, async () => {
    const res = await request(app).post('/api/v1/auth/signup').type('form').send({
      fullname: 'khong dieu kien',
      username: 'asdasd@gmail.com',
      password: 'asdasdasd', // weak
      'confirm-password': 'Bruh0!0!',
    });
    expect(res.status).toBe(400);
  });

  test(`invalid confirm-password - not match`, async () => {
    const res = await request(app).post('/api/v1/auth/signup').type('form').send({
      fullname: 'khong dieu kien',
      username: 'asdasd@gmail.com',
      password: 'Bruh0!0!', // not match
      'confirm-password': 'asd',
    });
    expect(res.status).toBe(400);
  });
});

describe.skip(`POST /login`, () => {
  test(`valid login`, async () => {
    const res = await request(app).post('/api/v1/auth/login').type('form').send({ username: 'khongdieukien@gmail.com', password: 'Bruh0!0!' });
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/success/gi);
    expect(res.body.user.fullname).toMatch(/khong dieu kien/gi);
    expect(res.body.user).toBeTruthy();

    // then use the returned token to get authenticated route
    const token = res.body.token;
    // console.log(token);

    const resGet = await request(app).get('/api/v1/user').set('Authorization', `Bearer ${token}`);
    expect(resGet.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
  });

  test(`GET /user need authentication`, async () => {
    const res = await request(app).get('/api/v1/user');
    expect(res.status).toBe(401);
  });

  test(`GET /chat need authentication`, async () => {
    const res = await request(app).get('/api/v1/chat');
    expect(res.status).toBe(401);
  });

  test(`wrong username`, async () => {
    const resLogin = await request(app).post('/api/v1/auth/login').type('form').send({ username: 'asdasdasd', password: 'Bruh0!0!' });
    expect(resLogin.status).toBe(400);
  });

  test(`wrong password`, async () => {
    const resLogin = await request(app).post('/api/v1/auth/login').type('form').send({ username: 'asdasdasd@gmail.com', password: 'ruh0!0!' });
    expect(resLogin.status).toBe(400);
  });
});
