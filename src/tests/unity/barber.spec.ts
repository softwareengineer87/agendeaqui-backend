import { Barber } from "../../domain/entities/Barber";

describe('Barber', () => {
  it('shoud create a barber', () => {
    const barber = Barber.create(
      'Barbearia old',
      'barberold@gmail.com',
      'barberold',
      'Natal',
      'Lagoa nova',
      535,
      ''
    );
    expect(barber.email).toBe('barberold@gmail.com');
    console.log(barber);
  });

  it('shoud emcrypt password', async () => {
    const barber = Barber.create(
      'Barbearia old',
      'barberold@gmail.com',
      'barberold',
      'Natal',
      'Lagoa nova',
      535,
      ''
    );
    const hash = await barber.password.emcryptPassword('535');
    const match = await barber.password.decryptPassword('535', hash);
    console.log(hash);
    console.log(match);
  });

  it('shoud create token and return payload for barber shop', async () => {
    const barber = Barber.create(
      'Barbearia old',
      'barberold@gmail.com',
      'barberold',
      'Natal',
      'Lagoa nova',
      535,
      ''
    );
    const hash = await barber.password.emcryptPassword('535');
    const match = await barber.password.decryptPassword('535', hash);
    const token = barber.generateToken();
    const payload = barber.verifyToken(token);
    console.log(token);
    console.log(payload);
  });
});

