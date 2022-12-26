import MusicPlaylistClient from '../api/musicPlaylistClient';
import Authenticator from '../util/Authenticator';
import BindingClass from "../util/bindingClass";
import DataStore from "../util/DataStore";

/**
 * The header component for the website.
 */
export default class Header extends BindingClass {
    constructor(dataStore = new DataStore()) {
        super();
        const methodsToBind = ['clientLoaded', 'loadData', 'addHeaderToPage', 'updateUsernameInHeader', 'getUserInfoForHeader'];
        this.bindClassMethods(methodsToBind, this);
        this.dataStore = dataStore;
        this.dataStore.set('username', 'Loading...');
        this.dataStore.addChangeListener(this.updateUsernameInHeader);
    }

    /**
     * Once the client has loaded successfully, get the identity of the current user.
     * @param client an instance of MusicPlaylistClient.
     * @returns {Promise<void>}
     */
    async clientLoaded(client) {
        const identity = await client.getIdentity();
        this.dataStore.set('username', identity.username);
    }

    loadData() {
        this.client = new MusicPlaylistClient(
            new Authenticator(),
            { onReady: this.clientLoaded }
        );
    }

    /**
     * Add the header to the page.
     */
    addHeaderToPage() {
        document.getElementById('header').innerHTML = `
            <div class="site-title">
                <a class="header_home" href="index.html">Playlists</a>
            </div>
            <div id="user">
                ${this.getUserInfoForHeader()}
            </div>
        `;
    }

    /**
     * If the user is logged in, return the user's name.
     * Otherwise return HTML to display a login button.
     * @returns content for the user info portion of the header.
     */
    getUserInfoForHeader() {
        return this.dataStore.get('username');
    }

    /**
     * When the datastore has been updated, update the username in the header.
     */
    updateUsernameInHeader() {
        document.getElementById('user').innerText = this.getUserInfoForHeader();
    }
}
