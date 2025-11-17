import { rest } from 'msw';

export const handlers = [
  rest.post('http://braodcastts.com/api/v1/login', async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (!email || !password) {
      return res(ctx.status(401), ctx.json({ message: 'Credenciales inválidas' }));
    }
    return res(ctx.status(200), ctx.json({ token: 'fake-jwt-token', user: { id: 1, username: "user", email: email, password: password } }));
  }),

  rest.post('http://braodcastts.com/api/v1/register', async (req, res, ctx) => {
    const { username, email, password } = await req.json();
    if (!email || !password || !username) {
      return res(ctx.status(400), ctx.json({ message: 'Campos requeridos' }));
    }
    return res(
      ctx.status(201), ctx.json({ token: 'fake-jwt-token', user: { id: 2, username: username, email: email, password: password } })
    );
  }),

  rest.get('http://braodcastts.com/api/v1/user', (req, res, ctx) => {
    const auth = req.headers.get('authorization');
    if (auth === 'Bearer fake-jwt-token') {
      return res(ctx.status(200), ctx.json({ id: 1, username: "user", email: "dev@example.com", password: "password" }));
    }
    return res(ctx.status(401), ctx.json({ message: 'No autorizado' }));
  }),
];

