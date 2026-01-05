import { bcryptAdapter, envs, JWTAdapter } from "../../../config";
import { UserModel } from "../../../data/mongo";
import { CustomError, UserEntity } from "../../../domain";
import { RegisterUserDTO } from "../../../domain/dtos/auth/register-user.dto";
import { LoginUserDTO } from "../../../domain/dtos/auth/login-user.dto";
import { EmailService } from "./email.service";
export class AuthService {
  // DI - email service
  constructor(private readonly emailService: EmailService) {}

  private sendEmailValidationLink = async (email: string): Promise<boolean> => {
    const token = await JWTAdapter.generateJWT({ payload: {email} });
    if (!token) throw CustomError.internalServer("Error while creating JWT");
    const link = `${envs.APIENDPOINT}/auth/validate-email/${token}`;
    const html = `
    <h1>Validate your email</h1>
    <p>Click on the following link to validate your email</p>
    <a href="${link}">Validate</a>
    <a href="${link}">${link}</a>
    `;
    const options = {
      to: email,
      subject: "validate your email",
      htmlBody: html,
    };

    const wasSent = await this.emailService.sendEmail(options);
    if (!wasSent)
      throw CustomError.internalServer("Error while sending validation email");
    return wasSent;
  };

  public registerUser = async (registerUserDTO: RegisterUserDTO) => {
    const exists = await UserModel.findOne({ email: registerUserDTO.email });
    if (exists) throw CustomError.badRequest("Email already registered");

    try {
      // create new user
      const newUser = new UserModel(registerUserDTO);
      //hash pass
      newUser.password = await bcryptAdapter.hashPassword(newUser.password);
      const result = await newUser.save();
      //remove password
      const { password, ...userEntity } = UserEntity.createFromObject(result);
      // generate jwt
      const token = await JWTAdapter.generateJWT({
        payload: {
          id: userEntity.id,
        },
      });
      if (!token) throw CustomError.internalServer("Error while creating JWT");

      // send validation link
      await this.sendEmailValidationLink(userEntity.email);

      return {
        user: userEntity,
        token: token,
      };
    } catch (error) {
      throw new CustomError(500, `${error}`);
    }
  };

  public loginUser = async (loginUserDTO: LoginUserDTO) => {
    const user = await UserModel.findOne({ email: loginUserDTO.email });
    if (!user) throw CustomError.notFound("The email is not registered");
    // compare agains hash
    const hash = user.password;
    const passwordString = loginUserDTO.password;
    const isMatch = await bcryptAdapter.checkPassword(passwordString, hash);

    if (!isMatch)
      throw CustomError.unAuthorized("The email or password is incorrect");

    const { password, ...userEntity } = UserEntity.createFromObject(user);

    const token = await JWTAdapter.generateJWT({
      payload: {
        id: userEntity.id,
      },
    });

    if (!token) throw CustomError.internalServer("Error while creating JWT");

    return {
      user: userEntity,
      token: token,
    };
  };

  public validateEmailFromToken = async (token: string): Promise<void> => {
    // check if token is correct
    if (token.length < 100) throw CustomError.badRequest("Invalid token");
    // check if token is valid
    const payload = await JWTAdapter.validateJWT({ token });
    if (!payload) throw CustomError.unAuthorized("Token is invalid");
    // check if email exists
    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not in token");
    // validate email
    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.internalServer("The email does not exist");

    user.emailValidated = true;
    await user.save();
  };
}
