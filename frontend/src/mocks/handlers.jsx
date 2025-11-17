import { rest } from 'msw';

export const handlers = [
  rest.post('http://braodcastts.com/api/v1/login', async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (email === 'dev@example.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({ token: 'fake-jwt-token', user: { id: 1, name: 'Dev', email } })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({ message: 'Credenciales inválidas' })
    );
  }),

  rest.post('http://braodcastts.com/api/v1/register', async (req, res, ctx) => {
    const { username, email, password } = await req.json();

    // Reglas simples de validación para pruebas
    if (!email || !password || !username) {
      return res(ctx.status(400), ctx.json({ message: 'Campos requeridos' }));
    }

    // Simular éxito: devolver token para que el flujo de registro pueda continuar
    return res(
      ctx.status(201),
      ctx.json({ token: 'fake-jwt-token', user: { id: 2, name: username, email } })
    );
  }),

  rest.get('http://braodcastts.com/api/v1/user', (req, res, ctx) => {
    const auth = req.headers.get('authorization');
    if (auth === 'Bearer fake-jwt-token') {
      return res(ctx.status(200), ctx.json({ id: 1, name: 'Dev', email: 'dev@example.com' }));
    }
    return res(ctx.status(401), ctx.json({ message: 'No autorizado' }));
  }),
];

