import { HttpStatus,HttpException, Inject,forwardRef,Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../entities/users.entity';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/loginUserDto';
import { Payload } from './security/interface';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService : UsersService,
        private readonly jwtService : JwtService,
        private readonly configService : ConfigService        
    ){}

    // 로그인 : 권용교
    async validateUser(loginUserDto: LoginUserDto): Promise<{accessToken:string,refreshToken:string}> {

        const { email, password } = loginUserDto;
        let hash = parseInt(this.configService.get<string>('HASHCODE'));
        let tokenKey = this.configService.get<string>('TOKENKEY');
        let access_expiresIn = this.configService.get<string>('ACCESS_EXPIRESIN');
        let refresh_expiresIn = this.configService.get<string>('REFRESH_EXPIRESIN');
        let findUser: Users = await this.usersService.findOne(email);
        
        if(!findUser) throw new UnauthorizedException("이메일 혹은 비밀번호를 확인해주세요");
        
        const isPasswordValidated : boolean = await bcrypt.compare(
            password,
            findUser.password
        );
        
        if(!isPasswordValidated) throw new HttpException('비밀번호 불일치',HttpStatus.UNAUTHORIZED)

        let payload : Payload = { email:findUser.email, userId:findUser.userId}
        let accessToken = this.jwtService.sign(payload, {
            secret: tokenKey,
            expiresIn: access_expiresIn+'s',
        })

        let refreshToken = this.jwtService.sign({userId:findUser.userId}, {
            secret: tokenKey,
            expiresIn: refresh_expiresIn+'s',
        })

        let updateRefreshToken = await bcrypt.hash(refreshToken,hash);

        // refreshToken 암호화 해아함
        await this.usersService.updateRefreshToken(findUser.userId,updateRefreshToken)

        return { accessToken:accessToken, refreshToken:refreshToken }
    }

    // accessToken 유저 정보 조회 : 권용교
    async tokenValidateUser(payload:Payload) : Promise<Users | undefined>{
        let { userId } = payload
        return await this.usersService.findId(userId);
    }

    // access token 재발급 : 권용교
    // access token 만료 시 refresh token을 받아와서 유저 db에 저장된 refresh token이 일치하는지 확인 후 accessToken 재발급
    async refreshToken(refreshToken:string){
        try {

            let tokenKey = this.configService.get<string>('TOKENKEY');
            let access_expiresIn = this.configService.get<string>('ACCESS_EXPIRESIN');

            let verifyResult = await this.jwtService.verify(refreshToken,{secret:'KEY'})

            let findUser =  await this.usersService.findId(verifyResult.userId);
            
            let result = await bcrypt.compare(refreshToken,findUser.refreshToken);
            
            if(result){
                let payload : Payload = { email:findUser.email, userId:findUser.userId}
                let accessToken = this.jwtService.sign(payload, {
                    secret: tokenKey,
                    expiresIn: access_expiresIn+'s',
                })
                return { accessToken:accessToken }
            }else{
                throw new HttpException('refresh token forgery error',HttpStatus.BAD_REQUEST)
            }
        } catch (error) {
            throw new HttpException('refresh token expired error, plz login',HttpStatus.UNAUTHORIZED)
        }
    }


}
