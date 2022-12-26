import MusicPlaylistClient from '../api/musicPlaylistClient';
import BindingClass from "../util/bindingClass";

/**
 * The header component for the website.
 */
export default class Header extends BindingClass {
    constructor() {
        super();

        const methodsToBind = ['addHeaderToPage'];
        this.bindClassMethods(methodsToBind, this);

        this.client = new MusicPlaylistClient();
    }

    /**
     * Add the header to the page.
     */
    async addHeaderToPage() {
        const currentUser = await this.client.getIdentity();

        const siteTitle = this.createSiteTitle();
        const userInfo = this.createUserInfoForHeader(currentUser);

        const header = document.getElementById('header');
        header.appendChild(siteTitle);
        header.appendChild(userInfo);
    }

    createSiteTitle() {
        const homeLink = document.createElement('a');
        homeLink.classList.add('header_home');
        homeLink.href = 'index.html';
        homeLink.innerText = 'Playlists';

        const siteTitle = document.createElement('div');
        siteTitle.classList.add('site-title');
        siteTitle.appendChild(homeLink);

        return siteTitle;
    }

    createUserInfoForHeader(currentUser) {
        const userInfo = document.createElement('div');
        userInfo.classList.add('user');

        if (currentUser) {
            userInfo.innerText = currentUser.username;
        } else {
            userInfo.appendChild(this.createLoginLink());
        }

        return userInfo;
    }

    createLoginLink() {
        const loginLink = document.createElement('a');
        loginLink.classList.add('button');
        loginLink.href = '#';
        loginLink.innerText = 'Login';

        loginLink.addEventListener('click', async () => {
            await this.client.login();
        });

        return loginLink;
    }

}