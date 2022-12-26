import BindingClass from "./bindingClass";
import { Auth, Hub } from 'aws-amplify';

export default class Authenticator extends BindingClass {
    constructor() {
        super();

        const methodsToBind = ['getCurrentUserInfo']
        this.bindClassMethods(methodsToBind, this);

        this.configureCognito();
    }

    async getCurrentUserInfo() {
        const congnitoUser = await Auth.currentAuthenticatedUser();
        const { email, name } = congnitoUser.signInUserSession.idToken.payload;
        return { email, name };
    }

    configureCognito() {
        Auth.configure({
            userPoolId: 'us-east-2_QTpFlSazv',
            userPoolWebClientId: '48h596piis0q6kna7q27ut0h3s',
            oauth: {
                region: 'us-east-1',
                domain: 'hello-world.auth.us-east-2.amazoncognito.com',
                scope: ['email', 'openid', 'phone', 'profile'],
                redirectSignIn: 'http://localhost:8000',
                redirectSignOut: 'http://localhost:8000',
                responseType: 'code'
            }
        });
    }
}