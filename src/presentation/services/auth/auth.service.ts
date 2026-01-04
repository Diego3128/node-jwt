import { bcryptAdapter, JWTAdapter } from "../../../config";
import { UserModel } from "../../../data/mongo";
import { CustomError, UserEntity } from "../../../domain";
import { RegisterUserDTO } from "../../../domain/dtos/auth/register-user.dto";
import { LoginUserDTO } from "../../../domain/dtos/auth/login-user.dto";
export class AuthService {
  constructor() {}

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
      // encrypt password
      // generate jwt
      return {
        user: userEntity,
        token: "",
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
        email: userEntity.email,
      },
    });

    if (!token) throw CustomError.internalServer("Error while creating JWT");

    return {
      user: userEntity,
      token: token,
    };
  };
}
