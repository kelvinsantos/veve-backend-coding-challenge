import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: process.env.AUTH_EXPIRES_IN },
        }),
      ],
      providers: [AuthService],
      controllers: [AuthController],
      exports: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an access_token after inputting valid credentials', async () => {
    const signIn = await controller.signIn({
      username: 'john',
      password: 'changeme',
    });
    expect(signIn).toHaveProperty('access_token');
  });

  it('should return 401 Unauthorized after inputting invalid credentials', async () => {
    try {
      await controller.signIn({
        username: 'john',
        password: 'changeme2',
      });
    } catch (e) {
      expect(e.response.statusCode).toEqual(401);
      expect(e.response.message).toEqual('Unauthorized');
    }
  });

  it('should return a profile after inputting valid credentials', async () => {
    const signIn = await controller.signIn({
      username: 'john',
      password: 'changeme',
    });

    const req = { user: { access_token: signIn.access_token } };
    const profile = await controller.getProfile(req);
    expect(profile).toHaveProperty('access_token');
  });
});
